"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-color bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <span
        className={`${
          theme === "dark" ? "translate-x-7 bg-white text-black" : "translate-x-1 bg-black text-white"
        } flex h-6 w-6 items-center justify-center rounded-full  shadow-sm transition-transform duration-300 ease-in-out`}
      >
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="sr-only">{theme === "light" ? "Switch to dark theme" : "Switch to light theme"}</span>
    </button>
  )
}

export default ThemeSwitcher
