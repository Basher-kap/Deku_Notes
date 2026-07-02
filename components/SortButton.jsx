// components/SortButton.jsx

import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SORT_OPTIONS, COLORS } from '../constants'
import { useThemeContext } from '../context'
  
const SortButton = ({ sortOrder, onSortChange, selectedCategory }) => {
  const { theme } = useThemeContext()
  if (!selectedCategory) return null

  const currentIndex = SORT_OPTIONS.findIndex((o) => o.key === sortOrder)
  const current = SORT_OPTIONS[currentIndex] || SORT_OPTIONS[0]

  const handlePress = () => {
    const next = SORT_OPTIONS[(currentIndex + 1) % SORT_OPTIONS.length]
    onSortChange(next.key)
  }

  return (
    <TouchableOpacity style={[styles.button, {backgroundColor: theme.secondary}]} onPress={handlePress}>
      <Ionicons name={current.icon} size={18} color="#fff" />
      <Text style={styles.text}>Sort: {current.label}</Text>
    </TouchableOpacity>
  )
}

export default SortButton

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
})