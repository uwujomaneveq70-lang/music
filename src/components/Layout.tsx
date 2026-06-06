import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Player from './Player'

const NAV_ITEMS = [
  { path: '/music', label: '欧美', icon: '🎵' },
  { path: '/radio', label: '电台', icon: '📻' },
  { path: '/favorites', label: '收藏', icon: '⭐' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path: string) => {
    if (path === '/music') return location.pathname.startsWith('/music')
    if (path === '/radio') return location.pathname.startsWith('/radio')
    return location.pathname === path
  }

  return (
    <div className="flex flex-col h-dvh bg-surface-dark">
      <header className="flex-shrink-0 px-4 pt-safe pt-3 pb-2 flex items-center justify-between select-none">
        <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 via-accent to-cyan-400 bg-clip-text text-transparent">
          🎵 FreeMusic
        </h1>
        <span className="text-xs text-slate-500">网易云+Jamendo+电台</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-2">
        <Outlet />
      </main>

      <nav className="flex-shrink-0 flex items-center justify-around py-2 border-t border-white/5 bg-surface-dark/95 backdrop-blur safe-bottom">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              isActive(item.path) ? 'text-accent' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>

      <Player />
    </div>
  )
}
