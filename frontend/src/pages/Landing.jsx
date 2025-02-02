import { useAuth } from "@clerk/clerk-react"
import { Link, Outlet } from "react-router-dom"
import ThemeSwitcher from "../components/ThemeSwitcher"
import { TrendingUp, Menu, X } from "lucide-react"
import { useState } from "react"


const Landing = () => {
  const { isSignedIn } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="bg-surface border-b border-color sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-primary font-bold text-xl leading-tight">Roadmap</span>
                    <span className="text-secondary text-xs">Zero to Hero</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeSwitcher />
              {isSignedIn ? (
                <Link 
                  to="/overview" 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/sign-in" 
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <ThemeSwitcher />
              <button
                onClick={toggleMenu}
                className="ml-2 p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface/80"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-t border-color">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isSignedIn ? (
                <Link
                  to="/overview"
                  className="block px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="block px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-surface/80"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-primary text-lg font-semibold mb-4">Roadmap</h3>
              <p className="text-secondary">
                Empowering learners to become experts in their field.
              </p>
            </div>
            <div>
              <h3 className="text-primary text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-secondary hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/roadmaps" className="text-secondary hover:text-primary">
                    Roadmaps
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-secondary hover:text-primary">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-primary text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary hover:text-primary">Twitter</a>
                <a href="#" className="text-secondary hover:text-primary">LinkedIn</a>
                <a href="#" className="text-secondary hover:text-primary">GitHub</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-color pt-8 text-center">
            <p className="text-secondary">&copy; 2024 Roadmap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

