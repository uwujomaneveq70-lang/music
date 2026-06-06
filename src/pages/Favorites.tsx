import { usePlaylist } from '../hooks/usePlaylist'
import { usePlayer } from '../hooks/usePlayer'
import { formatDuration } from '../api/jamendo'
import { formatBitrate } from '../api/radio'

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = usePlaylist()
  const { playTrack, playStation, playNetease, current, isPlaying, togglePlay } = usePlayer()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">⭐ 我的收藏</h2>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">清空全部</button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3"><span className="text-5xl">⭐</span><p>还没有收藏</p><p className="text-sm">浏览歌曲和电台时点击收藏</p></div>
      ) : (
        <div className="space-y-1">
          {favorites.map(item => {
            const isTrack = item.type === 'track'
            const isNetease = item.type === 'netease'
            const isStation = item.type === 'station'
            const data = item.data as any
            const id = isStation ? data.stationuuid : data.id
            const name = data.name
            const subtitle = isTrack ? data.artist_name : isNetease ? data.artist_name : (data.tags || data.country || '')
            const image = isTrack ? (data.image || data.album_image) : isNetease ? data.album_image : data.favicon
            const isCurrent = isTrack ? current?.type === 'track' && current.track?.id === id :
              isNetease ? current?.type === 'netease' && current.netease?.id === id :
              current?.type === 'station' && current.station?.stationuuid === id

            return (
              <div key={id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${isCurrent ? 'bg-accent/10' : 'hover:bg-surface'}`}
                onClick={() => {
                  if (isCurrent) togglePlay()
                  else if (isTrack) playTrack(data)
                  else if (isNetease) playNetease(data)
                  else playStation(data)
                }}>
                <div className="w-11 h-11 rounded-lg bg-surface-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">{isStation ? '📻' : isNetease ? '🇨🇳' : '🎵'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : ''}`}>{isNetease ? '🇨🇳 ' : ''}{name}</p>
                  <p className="text-xs text-slate-400 truncate">{subtitle}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {isStation ? formatBitrate(data.bitrate || 0) : formatDuration(data.duration || 0)}
                </span>
                {isCurrent && isPlaying && (
                  <div className="flex gap-0.5 items-end h-3"><div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '60%' }} /><div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '100%' }} /><div className="w-0.5 bg-accent animate-pulse rounded" style={{ height: '40%' }} /></div>
                )}
                <button onClick={e => { e.stopPropagation(); removeFavorite(id) }} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
