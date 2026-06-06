const BASE = 'https://api.jamendo.com/v3.0'

// 你的 Client ID — 已填入
const CLIENT_ID = 'YOUR_CLIENT_ID'

function getClientId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jamendo_client_id') || CLIENT_ID
  }
  return CLIENT_ID
}

export function setClientId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jamendo_client_id', id)
  }
}

export function hasClientId(): boolean {
  const id = getClientId()
  return !!id && id !== 'YOUR_CLIENT_ID'
}

function buildUrl(endpoint: string, params: Record<string, string | number | undefined>) {
  const url = new URL(`${BASE}/${endpoint}/`)
  url.searchParams.set('client_id', getClientId())
  url.searchParams.set('format', 'jsonpretty')
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
  })
  return url.toString()
}

export interface JamendoTrack {
  id: string
  name: string
  duration: number
  artist_id: string
  artist_name: string
  album_name: string
  album_id: string
  image: string
  album_image: string
  audio: string
  audiodownload: string
  audiodownload_allowed: boolean
  releasedate: string
  license_ccurl: string
  musicinfo?: {
    tags?: { genres?: string[]; instruments?: string[]; vartags?: string[] }
    speed?: string
    vocalinstrumental?: string
  }
}

interface JamendoResponse {
  headers: { status: string; code: number; results_count: number; results_fullcount?: number }
  results: JamendoTrack[]
}

async function fetchJamendo(endpoint: string, params: Record<string, string | number | undefined> = {}) {
  const url = buildUrl(endpoint, params)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jamendo API error: ${res.status}`)
  const data: JamendoResponse = await res.json()
  if (data.headers.status === 'failed') throw new Error('Jamendo API failure')
  return data
}

export async function getTracks(params: {
  limit?: number; offset?: number; tags?: string; fuzzytags?: string
  search?: string; order?: string; boost?: string; featured?: number
  groupby?: string; include?: string
}) {
  return fetchJamendo('tracks', {
    ...params,
    limit: params.limit || 30,
    audioformat: 'mp32',
    imagesize: 300,
  })
}

export async function searchTracks(query: string, limit = 30) {
  return fetchJamendo('tracks', { search: query, limit, audioformat: 'mp32', imagesize: 300 })
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
