import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ChevronDown } from 'lucide-react'
import { ModeToggle } from '../theme-toggler/mode-toggle'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

function Navbar() {
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
        <div className="hidden items-center space-x-6 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Ferramentas <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/tools/mapeditor">Map Editor</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Início
          </Link>
          <Link
            to="/play"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Explorar
          </Link>
          <Link
            to="/acessar"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Acesso
          </Link>
          <Link
            to="/sobre"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Sobre
          </Link>
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
            <SheetContent side="right" className="w-[250px] px-4 sm:w-[300px]">
              <div className="flex flex-col space-y-4 pt-6">
                <Link to="/tools/mapeditor" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Map Editor
                  </Button>
                </Link>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Início
                  </Button>
                </Link>
                <Link to="/play" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Explorar
                  </Button>
                </Link>
                <Link to="/acessar" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Acesso
                  </Button>
                </Link>
                <Link to="/sobre" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sobre
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
