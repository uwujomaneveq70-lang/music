import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopStations } from '../api/radio'
import type { RadioStation } from '../api/radio'
import StationList from '../components/StationList'
import RadioGenreGrid from '../components/RadioGenreGrid'

export default function Radio() {
  const navigate = useNavigate()
  const [top, setTop] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopStations(60).then(d => setTop(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const [searchQ, setSearchQ] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}&type=radio`)
  }

  return (
    <div className="space-y-6 pb-2">
      <form onSubmit={handleSearch} className="relative">
        <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="搜索电台名称..." enterKeyHint="search"
          className="w-full h-11 pl-10 pr-4 bg-surface rounded-xl text-sm text-white placeholder-slate-500 border border-white/5 focus:border-accent/50 focus:outline-none" />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </form>
      <section><h2 className="text-base font-semibold mb-3">🎭 流派分类</h2><RadioGenreGrid /></section>
      <section><h2 className="text-base font-semibold mb-3">🔥 热门电台</h2><StationList stations={top} loading={loading} /></section>
    </div>
  )
}
