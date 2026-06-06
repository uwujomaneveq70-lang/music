const BASE = 'https://de1.api.radio-browser.info/json'

// 备用服务器（自动 fallback）
const SERVERS = [
  'https://de1.api.radio-browser.info/json',
  'https://de2.api.radio-browser.info/json',
  'https://at1.api.radio-browser.info/json',
  'https://nl1.api.radio-browser.info/json',
]

export interface RadioStation {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  country: string
  countrycode: string
  language: string
  languagecodes: string
  codec: string
  bitrate: number
  votes: number
  clickcount: number
  clicktrend: number
  lastcheckok: number
}

let serverIndex = 0
async function fetchRadio<T>(endpoint: string): Promise<T> {
  const url = `${SERVERS[serverIndex]}${endpoint}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    // 轮换服务器
    serverIndex = (serverIndex + 1) % SERVERS.length
    const fallback = `${SERVERS[serverIndex]}${endpoint}`
    const res = await fetch(fallback)
    return res.json()
  }
}

export async function getTopStations(limit = 50): Promise<RadioStation[]> {
  return fetchRadio<RadioStation[]>(`/stations/topclick/${limit}`)
}

export async function getStationsByTag(tag: string, limit = 50): Promise<RadioStation[]> {
  return fetchRadio<RadioStation[]>(`/stations/bytag/${encodeURIComponent(tag)}?limit=${limit}`)
}

export async function searchStations(query: string, limit = 50): Promise<RadioStation[]> {
  return fetchRadio<RadioStation[]>(`/stations/search?name=${encodeURIComponent(query)}&limit=${limit}`)
}

export async function getPopularTags(): Promise<{ name: string; stationcount: number }[]> {
  return fetchRadio<{ name: string; stationcount: number }[]>('/tags?limit=50&order=stationcount&reverse=true')
}

export function getFallbackFavicon(station: RadioStation): string {
  // 如果没有 favicon，生成一个基于名字的首字母圆
  return ''
}

export function isPlayable(station: RadioStation): boolean {
  return station.lastcheckok === 1 && !!station.url_resolved
}

export function formatBitrate(bitrate: number): string {
  if (bitrate >= 320) return '320k'
  if (bitrate >= 128) return `${bitrate}k`
  return `${bitrate}k`
}
