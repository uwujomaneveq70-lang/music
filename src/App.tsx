import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Radio from './pages/Radio'
import RadioGenre from './pages/RadioGenre'
import Music from './pages/Music'
import MusicGenre from './pages/MusicGenre'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import FullPlayer from './components/FullPlayer'
import { PlayerProvider } from './hooks/usePlayer'
import { PlaylistProvider } from './hooks/usePlaylist'

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <PlaylistProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<Music />} />
              <Route path="/music/:tag" element={<MusicGenre />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/radio/:tag" element={<RadioGenre />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
            <Route path="/player" element={<FullPlayer />} />
          </Routes>
        </PlaylistProvider>
      </PlayerProvider>
    </BrowserRouter>
  )
}
