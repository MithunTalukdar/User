import { useCallback, useEffect, useState } from 'react'

const KEY = 'rb_theme'

export function useDarkMode() {
  const [dark, setDark] = useState(() =>
    (document.documentElement.dataset.theme || 'light') === 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try {
      localStorage.setItem(KEY, dark ? 'dark' : 'light')
    } catch {
      /* storage unavailable */
    }
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return { dark, toggle }
}
