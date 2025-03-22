import { Route, Routes } from 'react-router-dom'
import './App.css'
import PolimapGame from '@/pages/game/game'
import Home from '@/pages/home/home'
import { ThemeProvider } from './components/providers/themeProvider'
import Navbar from './components/nav/navbar'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<PolimapGame />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
