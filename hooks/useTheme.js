// hooks/useTheme.js
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, DARK_COLORS, THEME_KEY } from '../constants'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY)
      if (saved !== null) setIsDark(JSON.parse(saved))
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const toggleTheme = async () => {
    try {
      const next = !isDark
      setIsDark(next)
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(next))
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const theme = isDark ? DARK_COLORS : COLORS

  return { isDark, toggleTheme, theme }
}