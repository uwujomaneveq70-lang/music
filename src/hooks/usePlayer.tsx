import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import type { RadioStation } from '../api/radio'
import type { JamendoTrack } from '../api/jamendo'
import type { NeteaseTrack } from '../api/netease'
import { getSongUrl } from '../api/netease'

export type MediaType = 'track' | 'station' | 'netease'

export interface Playable {
  type: MediaType
  track?: JamendoTrack
  station?: RadioStation
  netease?: NeteaseTrack
}

interface PlayerState {
  current: Playable | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  loading: boolean
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: JamendoTrack) => void
  playStation: (station: RadioStation) => void
  playNetease: (track: NeteaseTrack) => void
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<PlayerState>({
    current: null, isPlaying: false, currentTime: 0, duration: 0, volume: 0.8, loading: false,
  })

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }))
    const onDurationChange = () => { const d = audio.duration; if (isFinite(d)) setState(s => ({ ...s, duration: d })) }
    const onEnded = () => setState(s => ({ ...s, isPlaying: false }))
    const onPlay = () => setState(s => ({ ...s, isPlaying: true, loading: false }))
    const onPause = () => setState(s => ({ ...s, isPlaying: false }))
    const onWaiting = () => setState(s => ({ ...s, loading: true }))
    const onCanPlay = () => setState(s => ({ ...s, loading: false }))

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.pause(); audio.src = ''
    }
  }, [])

  const play = useCallback((src: string) => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = src
    audio.volume = state.volume
    audio.play().catch(() => {})
  }, [state.volume])

  const playTrack = useCallback((track: JamendoTrack) => {
    setState(s => ({ ...s, current: { type: 'track', track }, currentTime: 0, duration: 0, loading: true }))
    play(track.audio)
  }, [play])

  const playStation = useCallback((station: RadioStation) => {
    setState(s => ({ ...s, current: { type: 'station', station }, currentTime: 0, duration: Infinity, loading: true }))
    play(station.url_resolved)
  }, [play])

  const playNetease = useCallback(async (track: NeteaseTrack) => {
    setState(s => ({ ...s, current: { type: 'netease', netease: track }, currentTime: 0, duration: 0, loading: true }))
    try {
      const url = await getSongUrl(track.id)
      if (url) {
        play(url)
      } else {
        setState(s => ({ ...s, loading: false, isPlaying: false }))
        alert('这首歌暂时无法播放（可能需要网易云会员）')
      }
    } catch {
      setState(s => ({ ...s, loading: false, isPlaying: false }))
    }
  }, [play])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !state.current) return
    audio.paused ? audio.play().catch(() => {}) : audio.pause()
  }, [state.current])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause(); audio.src = ''
    setState(s => ({ ...s, current: null, isPlaying: false, loading: false, currentTime: 0, duration: 0 }))
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setState(s => ({ ...s, currentTime: time }))
  }, [])

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current
    if (audio) audio.volume = vol
    setState(s => ({ ...s, volume: vol }))
  }, [])

  return (
    <PlayerContext.Provider value={{ ...state, playTrack, playStation, playNetease, togglePlay, stop, seek, setVolume }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider')
  return ctx
}
