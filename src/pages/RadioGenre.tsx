import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStationsByTag } from '../api/radio'
import type { RadioStation } from '../api/radio'
import StationList from '../components/StationList'

const TAG_NAMES: Record<string, string> = {
  pop: '流行 Pop', rock: '摇滚 Rock', jazz: '爵士 Jazz', electronic: '电子 Electronic',
  classical: '古典 Classical', 'hip hop': '嘻哈 Hip Hop', metal: '金属 Metal', reggae: '雷鬼 Reggae',
  blues: '蓝调 Blues', country: '乡村 Country', lounge: '休闲 Lounge', ambient: '氛围 Ambient',
  funk: '放克 Funk', soul: '灵魂 Soul', latin: '拉丁 Latin', talk: '谈话 Talk',
}

export default function RadioGenre() {
  const { tag } = useParams<{ tag: string }>()
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tag) return
    setLoading(true)
    getStationsByTag(tag, 60).then(d => setStations(d)).catch(() => {}).finally(() => setLoading(false))
  }, [tag])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{TAG_NAMES[tag || ''] || tag}</h2>
      <StationList stations={stations} loading={loading} emptyMessage="该流派暂无可用电台" />
    </div>
  )
}
