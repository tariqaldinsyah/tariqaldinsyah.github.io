import { useState, useCallback, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  )

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.add('theme-transitioning')
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    setTheme(next)
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400)
  }, [theme])

  // Sync across components
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') || 'dark'
      setTheme(t)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return { theme, toggle }
}
