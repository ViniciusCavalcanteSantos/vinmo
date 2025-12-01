'use client'

import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'

export type Theme = 'light' | 'dark' | 'system'

type Ctx = {
  theme: Theme
  setTheme: (m: Theme) => void
  resolved: 'light' | 'dark'
}

const ThemeContext = createContext<Ctx | null>(null)

export function ThemeProvider(
  {
    children,
    initialTheme = 'system'
  }: { children: React.ReactNode; initialTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')
  const getSystemTheme = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  useEffect(() => {
    const resolveTheme = () => {
      if (theme === 'system') {
        return getSystemTheme()
      }
      return theme
    }
    const r = resolveTheme()
    setResolved(r)

    const root = document.documentElement
    if (r === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.setAttribute('data-theme', r)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const newResolved = mq.matches ? 'dark' : 'light'
      setResolved(newResolved)
      const root = document.documentElement
      if (newResolved === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      root.setAttribute('data-theme', newResolved)
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setResolved(newTheme === 'system' ? getSystemTheme() : newTheme)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`
  }

  const value = useMemo(
    () => ({theme, setTheme, resolved}),
    [theme, resolved]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
