// components/dashboard/CategoryPreview.jsx
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useThemeContext } from '../../context/ThemeContext'

const CategoryPreview = ({ category }) => {
  const { theme } = useThemeContext()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => router.push(`/notes?category=${category.id}`)}
    >
      <View style={styles.titleRow}>
        <Ionicons
          name={category.favorite ? 'star' : 'folder'}
          size={18}
          color={category.favorite ? '#FFD700' : theme.primary}
        />
        <Text style={[styles.categoryName, { color: theme.textPrimary }]} numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CategoryPreview

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryName: { fontSize: 14, fontWeight: '600', marginLeft: 6, flexShrink: 1 },
  itemCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    marginLeft: 4,
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
})