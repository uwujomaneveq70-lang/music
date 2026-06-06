import { song_url_v1 } from 'NeteaseCloudMusicApi'

export default async function handler(req: any, res: any) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'id required' })
  }

  try {
    const result = await song_url_v1({ id: String(id), level: 'standard' })
    const data = result.body.data?.[0]
    
    return res.json({
      id: String(id),
      url: data?.url || '',
      freeTrialInfo: data?.freeTrialInfo || null,
    })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
