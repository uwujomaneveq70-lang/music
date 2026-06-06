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
  const id = url.searchParams.get('id') || ''
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const data = await callNetease(`/song/url/v1?id=${id}&level=standard`)
  if (!data) return Response.json({ url: '' })

  return Response.json({ id, url: data.data?.[0]?.url || '' })
}

export { GET as POST }
