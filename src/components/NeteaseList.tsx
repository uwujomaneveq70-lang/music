import type { NeteaseTrack } from '../api/netease'
import NeteaseCard from './NeteaseCard'

interface Props { tracks: NeteaseTrack[]; loading?: boolean; emptyMessage?: string }

export default function NeteaseList({ tracks, loading, emptyMessage = '没有找到歌曲' }: Props) {
  if (loading) return <div className="grid grid-cols-2 gap-3">{Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="bg-surface rounded-xl overflow-hidden animate-pulse"><div className="aspect-square bg-surface-light" /><div className="p-3 space-y-2"><div className="h-4 bg-surface-light rounded w-3/4" /><div className="h-3 bg-surface-light rounded w-1/2" /></div></div>
  ))}</div>
  if (tracks.length === 0) return <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3"><span className="text-4xl">🎶</span><p>{emptyMessage}</p></div>
  return <div className="grid grid-cols-2 gap-3">{tracks.map(t => <NeteaseCard key={t.id} track={t} />)}</div>
}
