import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { RadioStation } from '../api/radio'
import type { JamendoTrack } from '../api/jamendo'
import type { NeteaseTrack } from '../api/netease'

export type FavoriteItem =
  | { type: 'track'; data: JamendoTrack }
  | { type: 'station'; data: RadioStation }
  | { type: 'netease'; data: NeteaseTrack }

interface PlaylistContextType {
  favorites: FavoriteItem[]
  addTrack: (track: JamendoTrack) => void
  addStation: (station: RadioStation) => void
  addNetease: (track: NeteaseTrack) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
}

const PlaylistContext = createContext<PlaylistContextType | null>(null)
const STORAGE_KEY = 'music-pwa-favorites-v3'

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)) }, [favorites])

  const add = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      const id = item.type === 'track' ? item.data.id : item.type === 'netease' ? item.data.id : item.data.stationuuid
      if (prev.some(f => {
        const fid = f.type === 'track' ? f.data.id : f.type === 'netease' ? f.data.id : f.data.stationuuid
        return fid === id
      })) return prev
      return [...prev, item]
    })
  }, [])

  const addTrack = useCallback((track: JamendoTrack) => add({ type: 'track', data: track }), [add])
  const addStation = useCallback((station: RadioStation) => add({ type: 'station', data: station }), [add])
  const addNetease = useCallback((track: NeteaseTrack) => add({ type: 'netease', data: track }), [add])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => {
      if (f.type === 'track' || f.type === 'netease') return f.data.id !== id
      return f.data.stationuuid !== id
    }))
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => {
      if (f.type === 'track' || f.type === 'netease') return f.data.id === id
      return f.data.stationuuid === id
    })
  }, [favorites])

  return (
    <PlaylistContext.Provider value={{ favorites, addTrack, addStation, addNetease, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const ctx = useContext(PlaylistContext)
  if (!ctx) throw new Error('usePlaylist must be inside PlaylistProvider')
  return ctx
}
