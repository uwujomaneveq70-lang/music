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

export async function GET() {
  const data = await callNetease('/playlist/track/all?id=3778678&limit=30')
  if (!data) return Response.json({ error: 'service unavailable' }, { status: 503 })

  const tracks = data.songs || []
  const songs = tracks.map((t: any) => ({
    id: String(t.id),
    name: t.name,
    duration: Math.floor((t.dt || 0) / 1000),
    artist_name: t.ar?.map((a: any) => a.name).join(' / ') || '',
    album_name: t.al?.name || '',
    album_image: t.al?.picUrl || '',
    image: t.al?.picUrl || '',
  }))

  return Response.json({ results: songs })
}

export { GET as POST }
