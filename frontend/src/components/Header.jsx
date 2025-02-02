import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { TrendingUp } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Logo and Title - Left Side */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-primary font-bold text-xl leading-tight">Roadmap</span>
          <span className="text-secondary text-xs">Zero to Hero</span>
        </div>
      </div>

      {/* Theme Switcher and User Button - Right Side */}
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </header>
  )
}