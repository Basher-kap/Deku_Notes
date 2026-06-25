// hooks/useSidebar.js

import { useState, useRef } from 'react'
import { Animated } from 'react-native'
import { SIDEBAR_WIDTH } from '../constants'

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current

  const animate = (toValue, open) => {
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start()
    setSidebarOpen(open)
  }

  const toggleSidebar = () => animate(sidebarOpen ? -SIDEBAR_WIDTH : 0, !sidebarOpen)
  const closeSidebar = () => animate(-SIDEBAR_WIDTH, false)

  return { sidebarOpen, slideAnim, toggleSidebar, closeSidebar }
}