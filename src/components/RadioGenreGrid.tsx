import { useNavigate } from 'react-router-dom'

const GENRES = [
  { id: 'pop', name: '流行', nameEn: 'Pop', emoji: '🎤' },
  { id: 'rock', name: '摇滚', nameEn: 'Rock', emoji: '🎸' },
  { id: 'jazz', name: '爵士', nameEn: 'Jazz', emoji: '🎷' },
  { id: 'electronic', name: '电子', nameEn: 'Electronic', emoji: '🎧' },
  { id: 'classical', name: '古典', nameEn: 'Classical', emoji: '🎻' },
  { id: 'hip hop', name: '嘻哈', nameEn: 'Hip Hop', emoji: '🎯' },
  { id: 'metal', name: '金属', nameEn: 'Metal', emoji: '🤘' },
  { id: 'reggae', name: '雷鬼', nameEn: 'Reggae', emoji: '🌴' },
  { id: 'blues', name: '蓝调', nameEn: 'Blues', emoji: '🎹' },
  { id: 'country', name: '乡村', nameEn: 'Country', emoji: '🤠' },
  { id: 'lounge', name: '休闲', nameEn: 'Lounge', emoji: '🍸' },
  { id: 'ambient', name: '氛围', nameEn: 'Ambient', emoji: '🌌' },
  { id: 'funk', name: '放克', nameEn: 'Funk', emoji: '🕺' },
  { id: 'soul', name: '灵魂', nameEn: 'Soul', emoji: '🎶' },
  { id: 'latin', name: '拉丁', nameEn: 'Latin', emoji: '💃' },
  { id: 'talk', name: '谈话', nameEn: 'Talk', emoji: '🎙️' },
]

export default function RadioGenreGrid() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {GENRES.map(g => (
        <button key={g.id} onClick={() => navigate(`/radio/${g.id}`)} className="flex items-center gap-3 p-4 bg-surface rounded-xl hover:bg-surface-light transition-colors text-left">
          <span className="text-2xl">{g.emoji}</span>
          <div><p className="text-sm font-medium">{g.name}</p><p className="text-xs text-slate-500">{g.nameEn}</p></div>
        </button>
      ))}
    </div>
  )
}
