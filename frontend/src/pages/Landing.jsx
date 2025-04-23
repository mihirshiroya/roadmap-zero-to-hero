import { useAuth } from "@clerk/clerk-react"
import { Link, Outlet } from "react-router-dom"
import ThemeSwitcher from "../components/ThemeSwitcher"
import { TrendingUp, Menu, X,Twitter, Linkedin, Github } from "lucide-react"
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
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Roadmap
            </h2>
            <p className="text-slate-300 mt-2 max-w-md">
              Empowering learners to become experts in their field through guided learning paths.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Twitter size={20} className="text-sky-400" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Linkedin size={20} className="text-blue-400" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
              <Github size={20} className="text-slate-200" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-white/10">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/roadmaps"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-slate-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 rounded-l-md px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-r-md transition-colors duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Roadmap. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default Landing

