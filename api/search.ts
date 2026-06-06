// 网易云 API 代理函数
// 统一调用公开的 API 服务

const PROXIES = [
  'https://netease-cloud-music-api-phi-azure.vercel.app',
  'https://music-api-ten-mu.vercel.app',
]

let proxyIdx = 0

async function callNetease(path: string): Promise<any> {
  const base = PROXIES[proxyIdx]
  try {
    const resp = await fetch(`${base}${path}`)
    if (resp.ok) return resp.json()
  } catch {}
  proxyIdx = (proxyIdx + 1) % PROXIES.length
  try {
    const resp = await fetch(`${PROXIES[proxyIdx]}${path}`)
    if (resp.ok) return resp.json()
  } catch {}
  return null
}

export const config = { runtime: 'edge' }

export async function GET(req: Request) {
  const url = new URL(req.url)
  const keywords = url.searchParams.get('keywords') || ''
  const limit = url.searchParams.get('limit') || '30'

  if (!keywords) return Response.json({ error: 'keywords required' }, { status: 400 })

  const data = await callNetease(`/search?keywords=${encodeURIComponent(keywords)}&limit=${limit}&type=1`)
  if (!data) return Response.json({ error: 'service unavailable' }, { status: 503 })

  const songs = data.result?.songs || []
  const tracks = songs.map((s: any) => ({
    id: String(s.id),
    name: s.name,
    duration: Math.floor((s.dt || 0) / 1000),
    artist_name: s.ar?.map((a: any) => a.name).join(' / ') || '',
    album_name: s.al?.name || '',
    album_image: s.al?.picUrl || '',
    image: s.al?.picUrl || '',
  }))

  return Response.json({ results: tracks })
}

export { GET as POST }
