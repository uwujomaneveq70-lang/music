import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../hooks/usePlayer'
import { formatDuration } from '../api/jamendo'
import { formatBitrate } from '../api/radio'

export default function Player() {
  const { current, isPlaying, currentTime, duration, loading, togglePlay } = usePlayer()
  const navigate = useNavigate()
  if (!current) return null

  const isTrack = current.type === 'track'
  const isNetease = current.type === 'netease'
  const isStation = current.type === 'station'

  const name = isTrack ? current.track!.name : isNetease ? current.netease!.name : current.station!.name
  const subtitle = isTrack ? current.track!.artist_name : isNetease ? current.netease!.artist_name : (current.station!.tags || current.station!.country || '')
  const image = isTrack ? (current.track!.image || current.track!.album_image) : isNetease ? current.netease!.album_image : current.station!.favicon
  const showProgress = !isStation
  const progress = showProgress && duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex-shrink-0 border-t border-white/5 bg-surface/95 backdrop-blur">
      {showProgress && (<div className="h-0.5 bg-white/10"><div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} /></div>)}
      {isStation && loading && (<div className="h-0.5 bg-surface-light"><div className="h-full bg-accent animate-pulse w-1/2" /></div>)}

      <div className="flex items-center gap-3 px-4 py-2 cursor-pointer safe-bottom" onClick={() => navigate('/player')}>
        <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0 overflow-hidden">
          {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">{isStation ? '📻' : '🎵'}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{isNetease ? '🇨🇳 ' : isStation ? '📻 ' : '🎵 '}{name}</p>
          <p className="text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {showProgress && <span className="text-xs text-slate-500 w-10 text-right tabular-nums">{formatDuration(currentTime)}</span>}
          <button onClick={e => { e.stopPropagation(); togglePlay() }} className="w-9 h-9 flex items-center justify-center rounded-full bg-accent text-surface-dark hover:bg-accent-hover transition-colors">
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
