import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTracks, searchTracks, hasClientId, setClientId } from '../api/jamendo'
import type { JamendoTrack } from '../api/jamendo'
import TrackList from '../components/TrackList'
import GenreGrid from '../components/MusicGenreGrid'

export default function Music() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<JamendoTrack[]>([])
  const [popular, setPopular] = useState<JamendoTrack[]>([])
  const [loadingF, setLoadingF] = useState(true)
  const [loadingP, setLoadingP] = useState(true)
  const [needSetup, setNeedSetup] = useState(false)
  const [clientIdInput, setClientIdInput] = useState('')

  useEffect(() => {
    if (!hasClientId()) { setNeedSetup(true); return }
    getTracks({ featured: 1, limit: 12, groupby: 'artist_id', order: 'popularity_total' })
      .then(d => setFeatured(d.results)).catch(() => {}).finally(() => setLoadingF(false))
    getTracks({ order: 'popularity_total', limit: 12, groupby: 'artist_id' })
      .then(d => setPopular(d.results)).catch(() => {}).finally(() => setLoadingP(false))
  }, [])

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientIdInput.trim()) {
      setClientId(clientIdInput.trim())
      setNeedSetup(false)
      window.location.reload()
    }
  }

  if (needSetup) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-5xl">🎵</span>
            <h2 className="text-xl font-bold">设置 Jamendo Client ID</h2>
            <p className="text-sm text-slate-400">
              去 <a href="https://devportal.jamendo.com" target="_blank" rel="noopener" className="text-accent underline">devportal.jamendo.com</a> 免费注册获取
            </p>
          </div>
          <form onSubmit={handleSetup} className="space-y-3">
            <input
              type="text" value={clientIdInput}
              onChange={e => setClientIdInput(e.target.value)}
              placeholder="粘贴你的 Client ID"
              className="w-full h-11 px-4 bg-surface rounded-xl text-sm text-white placeholder-slate-500 border border-white/5 focus:border-accent/50 focus:outline-none"
              autoFocus
            />
            <button type="submit" className="w-full h-11 rounded-xl bg-accent text-surface-dark font-semibold hover:bg-accent-hover transition-colors">确认</button>
          </form>
        </div>
      </div>
    )
  }

  const [searchQ, setSearchQ] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}&type=music`)
  }

  return (
    <div className="space-y-6 pb-2">
      <form onSubmit={handleSearch} className="relative">
        <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="搜索歌曲、艺人..." enterKeyHint="search"
          className="w-full h-11 pl-10 pr-4 bg-surface rounded-xl text-sm text-white placeholder-slate-500 border border-white/5 focus:border-accent/50 focus:outline-none" />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </form>
      <section><h2 className="text-base font-semibold mb-3">🎭 风格流派</h2><GenreGrid /></section>
      <section><h2 className="text-base font-semibold mb-3">⭐ 精选推荐</h2><TrackList tracks={featured} loading={loadingF} /></section>
      <section><h2 className="text-base font-semibold mb-3">🔥 热门排行</h2><TrackList tracks={popular} loading={loadingP} /></section>
    </div>
  )
}
