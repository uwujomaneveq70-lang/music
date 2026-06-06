import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchStations } from '../api/radio'
import { searchTracks } from '../api/jamendo'
import type { RadioStation } from '../api/radio'
import type { JamendoTrack } from '../api/jamendo'
import StationList from '../components/StationList'
import TrackList from '../components/TrackList'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'all'

  const [stations, setStations] = useState<RadioStation[]>([])
  const [tracks, setTracks] = useState<JamendoTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    Promise.all([
      type !== 'music' ? searchStations(query, 30) : Promise.resolve([]),
      type !== 'radio' ? searchTracks(query, 30).then(d => d.results).catch(() => []) : Promise.resolve([]),
    ]).then(([s, t]) => {
      setStations(s)
      setTracks(t)
    }).finally(() => setLoading(false))
  }, [query, type])

  const totalResults = stations.length + tracks.length

  return (
    <div className="space-y-6">
      {!searched && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
          <span className="text-5xl">🔍</span>
          <p>在点歌和电台页面搜索</p>
        </div>
      )}

      {searched && (
        <>
          <p className="text-sm text-slate-400">
            {loading ? '搜索中...' : `"${query}" — 共 ${totalResults} 个结果`}
          </p>

          {tracks.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-3">🎵 歌曲</h2>
              <TrackList tracks={tracks} loading={loading} />
            </section>
          )}

          {stations.length > 0 && (
            <section>
              <h2 className="text-base font-semibold mb-3">📻 电台</h2>
              <StationList stations={stations} loading={loading} />
            </section>
          )}

          {!loading && totalResults === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
              <span className="text-4xl">😕</span>
              <p>没有找到相关内容</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
