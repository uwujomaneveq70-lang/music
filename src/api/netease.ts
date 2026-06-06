interface NeteaseTrack {
  id: string
  name: string
  duration: number
  artist_name: string
  album_name: string
  album_image: string
  image: string
}

export type { NeteaseTrack }

export async function searchSongs(keywords: string, limit = 30): Promise<NeteaseTrack[]> {
  const res = await fetch(`/api/search?keywords=${encodeURIComponent(keywords)}&limit=${limit}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.results || []
}

export async function getHotSongs(): Promise<NeteaseTrack[]> {
  const res = await fetch('/api/hot')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.results || []
}

export async function getSongUrl(id: string): Promise<string> {
  const res = await fetch(`/api/song-url?id=${id}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.url || ''
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
