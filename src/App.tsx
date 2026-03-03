import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/home'
import { ThemeProvider } from './providers/themeProvider'
import Acessar from './pages/acessar/acessar'
import Sobre from './pages/sobre/sobre'
import Tutorial from './pages/tutorial/tutorial'
import PolimapGame from './pages/game/game'
import MapEditor from './pages/tools/mapEditor'
import Navbar from './components/navbar/navbar'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acessar" element={<Acessar />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/play" element={<PolimapGame />} />
          <Route path="/tools/mapeditor" element={<MapEditor />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
