import { useEffect, useState } from 'react'

const ColorSchemeToggleTailwind = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all'
      aria-label='Toggle Dark Mode'
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

export default ColorSchemeToggleTailwind
