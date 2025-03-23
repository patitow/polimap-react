import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { ModeToggle } from '../theme-toggler/mode-toggle'

const Navbar: React.FC = () => {
  const [isLogged, setIsLogged] = useState(true)

  return (
    <nav className="bg-primary-foreground absolute top-0 left-0 z-[1] w-full border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link to={isLogged ? '/play' : '/'}>
            <img src="/polimap.svg" alt="PoliMap" className="h-16" />
          </Link>
        </div>

        {/* Botões de navegação */}
        <div className="flex items-center space-x-4">
          {isLogged ? (
            <>
              <Link to="/play">
                <Button variant="default">Jogar</Button>
              </Link>
              <Link to="/quit">
                <Button variant="destructive">Sair</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/auth">
                <Button variant="default">Cadastro</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
