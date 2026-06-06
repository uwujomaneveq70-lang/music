import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTracks } from '../api/jamendo'
import type { JamendoTrack } from '../api/jamendo'
import TrackList from '../components/TrackList'

const GENRE_NAMES: Record<string, string> = {
  rock: '摇滚 Rock', electronic: '电子 Electronic', pop: '流行 Pop', jazz: '爵士 Jazz',
  hiphop: '嘻哈 Hip Hop', classical: '古典 Classical', metal: '金属 Metal', lounge: '休闲 Lounge',
  funk: '放克 Funk', blues: '蓝调 Blues', reggae: '雷鬼 Reggae', ambient: '氛围 Ambient',
  country: '乡村 Country', rnb: 'R&B', soul: '灵魂 Soul', latin: '拉丁 Latin',
}

export default function MusicGenre() {
  const { tag } = useParams<{ tag: string }>()
  const [tracks, setTracks] = useState<JamendoTrack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tag) return
    setLoading(true)
    getTracks({ tags: tag, featured: 1, limit: 40, groupby: 'artist_id' })
      .then(d => setTracks(d.results)).catch(() => {}).finally(() => setLoading(false))
  }, [tag])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{GENRE_NAMES[tag || ''] || tag}</h2>
      <TrackList tracks={tracks} loading={loading} emptyMessage="该流派暂无歌曲" />
    </div>
  )
}
