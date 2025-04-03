import { Route, Routes } from 'react-router-dom'
import './App.css'
import PolimapGame from '@/pages/game/game'
import Home from '@/pages/home/home'
import { ThemeProvider } from './providers/themeProvider'
import Navbar from './components/nav/navbar'
import Tutorial from './pages/tutorial/tutorial'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<PolimapGame />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
