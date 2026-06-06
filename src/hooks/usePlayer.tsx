import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import type { RadioStation } from '../api/radio'
import type { JamendoTrack } from '../api/jamendo'

export type MediaType = 'track' | 'station'

export interface Playable {
  type: MediaType
  track?: JamendoTrack
  station?: RadioStation
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
  togglePlay: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  playNext: (queue: (JamendoTrack | RadioStation)[]) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<PlayerState>({
    current: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    loading: false,
  })

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    const onTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }))
    const onDurationChange = () => {
      const d = audio.duration
      if (isFinite(d)) setState(s => ({ ...s, duration: d }))
    }
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
      audio.pause()
      audio.src = ''
    }
  }, [])

  const playTrack = useCallback((track: JamendoTrack) => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = track.audio
    audio.volume = state.volume
    audio.play().catch(() => {})
    setState(s => ({ ...s, current: { type: 'track', track }, currentTime: 0, duration: 0, loading: true }))
  }, [state.volume])

  const playStation = useCallback((station: RadioStation) => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = station.url_resolved
    audio.volume = state.volume
    audio.play().catch(() => {})
    setState(s => ({ ...s, current: { type: 'station', station }, currentTime: 0, duration: Infinity, loading: true }))
  }, [state.volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !state.current) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [state.current])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = ''
    setState(s => ({ ...s, current: null, isPlaying: false, loading: false, currentTime: 0, duration: 0 }))
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || state.current?.type !== 'track') return
    audio.currentTime = time
    setState(s => ({ ...s, currentTime: time }))
  }, [state.current])

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current
    if (audio) audio.volume = vol
    setState(s => ({ ...s, volume: vol }))
  }, [])

  const playNext = useCallback((queue: (JamendoTrack | RadioStation)[]) => {
    // For stations, no "next" — it's infinite
    if (state.current?.type === 'station') return

    const tracks = queue.filter((q): q is JamendoTrack => 'audio' in q)
    const idx = tracks.findIndex(t => t.id === state.current?.track?.id)
    const next = idx >= 0 && idx < tracks.length - 1 ? tracks[idx + 1] : tracks[0]
    if (next) playTrack(next)
  }, [state.current, playTrack])

  return (
    <PlayerContext.Provider value={{ ...state, playTrack, playStation, togglePlay, stop, seek, setVolume, playNext }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider')
  return ctx
}
