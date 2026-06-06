import { search } from 'NeteaseCloudMusicApi'

export default async function handler(req: any, res: any) {
  const { keywords, limit = 30 } = req.query

  if (!keywords) {
    return res.status(400).json({ error: 'keywords required' })
  }

  try {
    const result = await search({ keywords, limit: Number(limit), type: 1 })
    const songs = result.body.result?.songs || []
    
    const tracks = songs.map((s: any) => ({
      id: String(s.id),
      name: s.name,
      duration: Math.floor(s.dt / 1000),
      artist_name: s.ar?.map((a: any) => a.name).join(' / ') || '',
      album_name: s.al?.name || '',
      album_image: s.al?.picUrl || '',
      image: s.al?.picUrl || '',
    }))

    return res.json({ results: tracks })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
