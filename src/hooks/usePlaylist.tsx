import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { RadioStation } from '../api/radio'
import type { JamendoTrack } from '../api/jamendo'

export type FavoriteItem =
  | { type: 'track'; data: JamendoTrack }
  | { type: 'station'; data: RadioStation }

interface PlaylistContextType {
  favorites: FavoriteItem[]
  addTrack: (track: JamendoTrack) => void
  addStation: (station: RadioStation) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
}

const PlaylistContext = createContext<PlaylistContextType | null>(null)
const STORAGE_KEY = 'music-pwa-favorites-v2'

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addTrack = useCallback((track: JamendoTrack) => {
    setFavorites(prev => {
      if (prev.find(f => f.type === 'track' && f.data.id === track.id)) return prev
      return [...prev, { type: 'track', data: track }]
    })
  }, [])

  const addStation = useCallback((station: RadioStation) => {
    setFavorites(prev => {
      if (prev.find(f => f.type === 'station' && f.data.stationuuid === station.stationuuid)) return prev
      return [...prev, { type: 'station', data: station }]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => {
      if (f.type === 'track') return f.data.id !== id
      return f.data.stationuuid !== id
    }))
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => {
      if (f.type === 'track') return f.data.id === id
      return f.data.stationuuid === id
    })
  }, [favorites])

  return (
    <PlaylistContext.Provider value={{ favorites, addTrack, addStation, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const ctx = useContext(PlaylistContext)
  if (!ctx) throw new Error('usePlaylist must be inside PlaylistProvider')
  return ctx
}
