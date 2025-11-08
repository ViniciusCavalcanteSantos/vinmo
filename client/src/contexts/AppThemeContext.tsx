'use client'

import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'

export type Theme = 'light' | 'dark' | 'system'

type Ctx = {
  theme: Theme
  setTheme: (m: Theme) => void
  resolved: 'light' | 'dark'
}

const ThemeContext = createContext<Ctx | null>(null)

function resolve(theme: Theme) {
  if (typeof window === 'undefined') return 'light' as const
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
}

export function ThemeProvider(
  {
    children,
    initial = 'system',
    storageKey = 'vinmo-theme',
  }: { children: React.ReactNode; initial?: Theme; storageKey?: string }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || initial
    } catch {
      return initial
    }
  })

  const resolved = useMemo(() => resolve(theme), [theme])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolved)
  }, [resolved])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const r = mq.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', r)
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [theme])

  const setThemePersist = (m: Theme) => {
    setTheme(m)
    try {
      localStorage.setItem(storageKey, m)
    } catch {
    }
  }

  const value = useMemo(
    () => ({theme, setTheme: setThemePersist, resolved}),
    [theme, resolved]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
