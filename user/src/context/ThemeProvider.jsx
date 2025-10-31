import React, { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="fixed top-4 cursor-pointer right-4 p-3 rounded-full bg-gray-200 text-yellow-500 shadow-md hover:scale-110 transition"
      >
        {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>
      {children}
    </div>
  )
}
