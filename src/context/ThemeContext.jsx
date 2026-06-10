import { createContext, useContext, useState } from 'react'

export const THEMES = {
  ocean: {
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #2100f5, #00bcc9)',
    particleColor: 'rgba(255, 255, 255, 0.7)',
    lineColor: 'rgba(255, 255, 255, 0.3)',
    accent: '#00bcc9',
    accentText: '#ffffff',
  },
  sunset: {
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #7c0000, #ff6a00)',
    particleColor: 'rgba(255, 220, 180, 0.7)',
    lineColor: 'rgba(255, 200, 150, 0.3)',
    accent: '#ff6a00',
    accentText: '#ffffff',
  },
  forest: {
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #0a4a0a, #56ab2f)',
    particleColor: 'rgba(200, 255, 200, 0.7)',
    lineColor: 'rgba(150, 255, 150, 0.3)',
    accent: '#56ab2f',
    accentText: '#ffffff',
  },
  midnight: {
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #0d0d0d, #434343)',
    particleColor: 'rgba(200, 200, 200, 0.7)',
    lineColor: 'rgba(200, 200, 200, 0.2)',
    accent: '#888888',
    accentText: '#ffffff',
  },
  candy: {
    name: 'Candy',
    gradient: 'linear-gradient(135deg, #6a0080, #ee82ee)',
    particleColor: 'rgba(255, 220, 255, 0.7)',
    lineColor: 'rgba(255, 180, 255, 0.3)',
    accent: '#ee82ee',
    accentText: '#ffffff',
  },
  golden: {
    name: 'Golden',
    gradient: 'linear-gradient(135deg, #c8a800, #fff4c5)',
    particleColor: 'rgba(180, 130, 0, 0.7)',
    lineColor: 'rgba(180, 130, 0, 0.3)',
    accent: '#c8a800',
    accentText: '#1a1a1a',
  },
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState('midnight')
  const theme = THEMES[themeKey]
  return (
    <ThemeContext.Provider value={{ themeKey, theme, setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}