import { usePlayer } from '../hooks/usePlayer'
import { usePlaylist } from '../hooks/usePlaylist'
import { formatDuration } from '../api/jamendo'
import type { JamendoTrack } from '../api/jamendo'

interface Props { track: JamendoTrack }

export default function TrackCard({ track }: Props) {
  const { playTrack, current, isPlaying, togglePlay } = usePlayer()
  const { addTrack, removeFavorite, isFavorite } = usePlaylist()
  const isCurrent = current?.type === 'track' && current.track?.id === track.id
  const fav = isFavorite(track.id)

  return (
    <div className={`bg-surface rounded-xl overflow-hidden group transition-all hover:bg-surface-light ${isCurrent ? 'ring-2 ring-accent' : ''}`}>
      <div className="relative aspect-square bg-surface-light" onClick={() => playTrack(track)}>
        <img src={track.image || track.album_image} alt={track.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-accent text-surface-dark flex items-center justify-center shadow-lg" onClick={e => { e.stopPropagation(); isCurrent ? togglePlay() : playTrack(track) }}>
            {isCurrent && isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 20,12 7,20" /></svg>
            )}
          </button>
        </div>
        <span className="absolute bottom-2 right-2 text-xs bg-black/60 px-1.5 py-0.5 rounded">{formatDuration(track.duration)}</span>
        {isCurrent && isPlaying && <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />}
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium truncate leading-tight">{track.name}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{track.artist_name}</p>
        <button onClick={e => { e.stopPropagation(); fav ? removeFavorite(track.id) : addTrack(track) }} className={`mt-2 text-xs flex items-center gap-1 transition-colors ${fav ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}>
          {fav ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </div>
  )
}
