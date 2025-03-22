import { useState } from 'react'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold">
            Logo
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden space-x-6 md:flex">
          <a href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </a>
          <a href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline" className="px-3 py-1">
            {menuOpen ? 'Close' : 'Menu'}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a href="/" className="block rounded-md px-3 py-2 text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a
              href="/about"
              className="block rounded-md px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              About
            </a>
            <a
              href="/contact"
              className="block rounded-md px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
