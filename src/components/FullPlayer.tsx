import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../hooks/usePlayer'
import { usePlaylist } from '../hooks/usePlaylist'
import { formatDuration } from '../api/jamendo'
import { formatBitrate } from '../api/radio'

export default function FullPlayer() {
  const navigate = useNavigate()
  const { current, isPlaying, currentTime, duration, loading, togglePlay, stop, seek, setVolume, volume } = usePlayer()
  const { favorites, addTrack, addStation, addNetease, removeFavorite, isFavorite } = usePlaylist()

  if (!current) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-surface-dark gap-4">
        <span className="text-6xl">🎵</span>
        <p className="text-slate-400">没有正在播放的内容</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 rounded-full bg-accent text-surface-dark font-medium">返回</button>
      </div>
    )
  }

  const isTrack = current.type === 'track'
  const isNetease = current.type === 'netease'
  const isStation = current.type === 'station'

  const name = isTrack ? current.track!.name : isNetease ? current.netease!.name : current.station!.name
  const subtitle = isTrack ? current.track!.artist_name : isNetease ? current.netease!.artist_name : (current.station!.tags || current.station!.country || '')
  const image = isTrack ? (current.track!.image || current.track!.album_image) : isNetease ? current.netease!.album_image : current.station!.favicon
  const totalDur = isTrack ? current.track!.duration : isNetease ? current.netease!.duration : 0
  const showProgress = !isStation && duration > 0 && isFinite(duration)
  const id = isTrack ? current.track!.id : isNetease ? current.netease!.id : current.station!.stationuuid
  const fav = id ? isFavorite(id) : false

  const toggleFav = () => {
    if (!id) return
    if (fav) removeFavorite(id)
    else {
      if (isTrack) addTrack(current.track!)
      else if (isNetease) addNetease(current.netease!)
      else addStation(current.station!)
    }
  }

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-surface-dark via-surface-dark to-surface relative overflow-hidden">
      {image && <div className="absolute inset-0 opacity-20 blur-3xl scale-150"><img src={image} alt="" className="w-full h-full object-cover" /></div>}

      <div className="relative z-10 flex items-center justify-between px-4 pt-safe pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{isStation ? '正在收听' : '正在播放'}</span>
        <button onClick={toggleFav} className={`p-2 ${fav ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-4">
        <div className={`w-56 h-56 sm:w-64 sm:h-64 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/5 bg-surface-light flex items-center justify-center ${!isStation && isPlaying ? 'animate-spin-slow' : ''}`}>
          {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-7xl">{isStation ? '📻' : '🎵'}</span>}
        </div>
        {loading && <div className="flex items-center gap-2 text-accent text-sm animate-pulse"><div className="w-2 h-2 bg-accent rounded-full" />连接中...</div>}
      </div>

      <div className="relative z-10 px-6 pb-8 safe-bottom space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-bold truncate">{isNetease ? '🇨🇳 ' : ''}{name}</h2>
          <p className="text-sm text-slate-400 truncate">{subtitle}</p>
          {totalDur > 0 && <p className="text-xs text-slate-500 mt-1">{formatDuration(totalDur)}</p>}
          {isStation && current.station && <p className="text-xs text-slate-500 mt-1">{current.station.codec} {current.station.bitrate ? formatBitrate(current.station.bitrate) : ''}</p>}
        </div>

        {showProgress && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-10 tabular-nums">{formatDuration(currentTime)}</span>
            <input type="range" min="0" max={duration} value={currentTime} onChange={e => seek(Number(e.target.value))}
              className="flex-1 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent" />
            <span className="text-xs text-slate-500 w-10 tabular-nums">{formatDuration(duration)}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          {isStation ? (
            <button onClick={stop} className="p-2 text-slate-400 hover:text-red-400"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg></button>
          ) : (
            <button className="p-2 text-slate-400 hover:text-white"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="4,12 14,4 14,20" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg></button>
          )}

          <button onClick={togglePlay} className="w-16 h-16 flex items-center justify-center rounded-full bg-accent text-surface-dark hover:bg-accent-hover transition-all active:scale-95 shadow-lg shadow-accent/20">
            {isPlaying ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,4 22,12 8,20" /></svg>
            )}
          </button>

          {isStation ? <div className="w-10" /> : (
            <button className="p-2 text-slate-400 hover:text-white"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="10,4 20,12 10,20" /><rect x="4" y="4" width="4" height="16" rx="1" /></svg></button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(Number(e.target.value))}
            className="flex-1 h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent" />
        </div>
      </div>
    </div>
  )
}
