import { top_playlist } from 'NeteaseCloudMusicApi'

export default async function handler(req: any, res: any) {
  try {
    // 热歌榜 id = 3778678, 新歌榜 = 3779629, 飙升榜 = 19723756
    const result = await top_playlist({ id: '3778678', limit: 30 })
    const tracks = result.body.playlist?.tracks || []
    
    const songs = tracks.map((t: any) => ({
      id: String(t.id),
      name: t.name,
      duration: Math.floor(t.dt / 1000),
      artist_name: t.ar?.map((a: any) => a.name).join(' / ') || '',
      album_name: t.al?.name || '',
      album_image: t.al?.picUrl || '',
      image: t.al?.picUrl || '',
    }))

    return res.json({ results: songs })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
