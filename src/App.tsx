import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/home'
import { ThemeProvider } from './providers/themeProvider'
import Acesso from './pages/acesso/acesso'
import Sobre from './pages/sobre/sobre'
import Tutorial from './pages/tutorial/tutorial'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acessar" element={<Acesso />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
