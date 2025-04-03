'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Menu, ChevronDown } from 'lucide-react'
import { ModeToggle } from '../theme-toggler/mode-toggle'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-primary-foreground fixed top-0 left-0 z-50 w-full border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div>
          <Link to="/">
            <img src="/polimap.svg" alt="PoliMap" className="h-12 md:h-16" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-4 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Tools <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/tools/mapeditor" className="w-full">
                  Map Editor
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] px-4">
              <div className="flex flex-col space-y-4 pt-6">
                <Link to="/tools/mapeditor" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Map Editor
                  </Button>
                </Link>

                {isSignedIn ? (
                  <>
                    <Link to="/play" onClick={() => setIsOpen(false)}>
                      <Button variant="default" className="w-full">
                        Jogar
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sua conta</span>
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: 'w-8 h-8',
                          },
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                        Cadastro
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
