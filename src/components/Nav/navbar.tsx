'use client'

import type React from 'react'
import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'
import { ModeToggle } from '../theme-toggler/mode-toggle'
import { Button } from '../ui/button'

const Navbar: React.FC = () => {
  const { isSignedIn } = useAuth()

  return (
    <nav className="bg-primary-foreground fixed top-0 left-0 z-50 max-h-16 min-h-16 w-full border-b shadow-sm">
      <div className="mx-16 flex h-16 items-center justify-between">
        <div>
          <Link to="/">
            <img src="/polimap.svg" alt="PoliMap" className="h-16" />
          </Link>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link to="/play">
                <Button variant="default">Jogar</Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-10 h-10',
                  },
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="secondary">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default">Cadastro</Button>
              </SignUpButton>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
