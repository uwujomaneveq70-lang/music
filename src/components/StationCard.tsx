import { usePlayer } from '../hooks/usePlayer'
import { usePlaylist } from '../hooks/usePlaylist'
import { formatBitrate, isPlayable } from '../api/radio'
import type { RadioStation } from '../api/radio'

interface Props { station: RadioStation }

export default function StationCard({ station }: Props) {
  const { playStation, current, isPlaying, togglePlay } = usePlayer()
  const { addStation, removeFavorite, isFavorite } = usePlaylist()
  const isCurrent = current?.type === 'station' && current.station?.stationuuid === station.stationuuid
  const fav = isFavorite(station.stationuuid)
  const playable = isPlayable(station)
  const tags = station.tags ? station.tags.split(',').slice(0, 2).map(t => t.trim()).filter(Boolean) : []

  return (
    <div className={`bg-surface rounded-xl overflow-hidden group transition-all hover:bg-surface-light ${isCurrent ? 'ring-2 ring-accent' : ''} ${!playable ? 'opacity-50' : ''}`}>
      <div className="relative aspect-square bg-surface-light flex items-center justify-center" onClick={() => playable && playStation(station)}>
        {station.favicon ? <img src={station.favicon} alt="" className="w-full h-full object-cover" loading="lazy" /> : <span className="text-5xl">📻</span>}
        {playable && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="w-12 h-12 rounded-full bg-accent text-surface-dark flex items-center justify-center shadow-lg" onClick={e => { e.stopPropagation(); isCurrent ? togglePlay() : playStation(station) }}>
              {isCurrent && isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 20,12 7,20" /></svg>
              )}
            </button>
          </div>
        )}
        {station.bitrate > 0 && <span className="absolute bottom-2 right-2 text-xs bg-black/60 px-1.5 py-0.5 rounded">{formatBitrate(station.bitrate)}</span>}
        {isCurrent && isPlaying && (
          <div className="absolute top-2 right-2 flex gap-0.5 items-end h-3">
            <div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '60%' }} /><div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '100%' }} /><div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '40%' }} />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium truncate leading-tight">{station.name}</p>
        <div className="flex flex-wrap gap-1 mt-1">{tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-surface-light rounded text-slate-400">{tag}</span>)}</div>
        {station.country && <p className="text-xs text-slate-500 mt-1">{station.country}</p>}
        <button onClick={e => { e.stopPropagation(); fav ? removeFavorite(station.stationuuid) : addStation(station) }} className={`mt-2 text-xs flex items-center gap-1 transition-colors ${fav ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}>
          {fav ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </div>
  )
}
