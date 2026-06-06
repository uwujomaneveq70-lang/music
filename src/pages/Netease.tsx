import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchSongs, getHotSongs } from '../api/netease'
import type { NeteaseTrack } from '../api/netease'
import NeteaseList from '../components/NeteaseList'

export default function Netease() {
  const navigate = useNavigate()
  const [hot, setHot] = useState<NeteaseTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHotSongs().then(d => setHot(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NeteaseTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSearched(true)
    try {
      const data = await searchSongs(query.trim(), 40)
      setResults(data)
    } catch { setResults([]) }
    setSearching(false)
  }

  return (
    <div className="space-y-6 pb-2">
      <form onSubmit={handleSearch} className="relative">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索华语歌曲（周杰伦、林俊杰...）" enterKeyHint="search"
          className="w-full h-11 pl-10 pr-4 bg-surface rounded-xl text-sm text-white placeholder-slate-500 border border-red-400/20 focus:border-red-400/50 focus:outline-none" />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </form>

      {searched ? (
        <section>
          <h2 className="text-base font-semibold mb-3 text-red-400">🔍 "{query}"</h2>
          <NeteaseList tracks={results} loading={searching} emptyMessage={`没有找到 "${query}"`} />
        </section>
      ) : (
        <section>
          <h2 className="text-base font-semibold mb-3">🔥 热歌榜</h2>
          <NeteaseList tracks={hot} loading={loading} />
        </section>
      )}
    </div>
  )
}
