// components/dashboard/ItemOfTheDay.jsx
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ITEM_OF_DAY_KEY } from '../../constants'
import { useThemeContext } from '../../context'

const getAllItems = (categories) =>
  categories.flatMap((cat) => cat.items.map((item) => ({ ...item, categoryName: cat.name })))

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const ItemOfTheDay = ({ categories }) => {
  const { theme } = useThemeContext()
  const [itemOfDay, setItemOfDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadItemOfDay() }, [categories])

  const saveNewItemOfDay = async (allItems) => {
    const item = pickRandom(allItems)
    await AsyncStorage.setItem(ITEM_OF_DAY_KEY, JSON.stringify({ date: new Date().toDateString(), item }))
    setItemOfDay(item)
  }

  const loadItemOfDay = async () => {
    try {
      const allItems = getAllItems(categories)
      if (allItems.length === 0) { setItemOfDay(null); return }
      const today = new Date().toDateString()
      const stored = await AsyncStorage.getItem(ITEM_OF_DAY_KEY)
      if (stored) {
        const { date, item } = JSON.parse(stored)
        if (date === today && allItems.find((i) => i.id === item.id)) { setItemOfDay(item); return }
      }
      await saveNewItemOfDay(allItems)
    } catch (error) {
      console.error('Error loading item of day:', error)
    } finally { setLoading(false) }
  }

  const refreshItemOfDay = async () => {
    const allItems = getAllItems(categories)
    if (allItems.length === 0) return
    try { await saveNewItemOfDay(allItems) }
    catch (error) { console.error('Error refreshing item of day:', error) }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Item of the Day</Text>
        <View style={[styles.card, { backgroundColor: theme.background, borderLeftColor: theme.primary }]}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    )
  }

  if (!itemOfDay) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Item of the Day</Text>
        <View style={[styles.emptyCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Ionicons name="document-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No items available</Text>
          <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
            Add some items to see your daily pick!
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Item of the Day</Text>
        <TouchableOpacity
          onPress={refreshItemOfDay}
          style={[styles.refreshButton, { backgroundColor: theme.background }]}
        >
          <Ionicons name="refresh" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.background, borderLeftColor: theme.primary }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.itemName, { color: theme.textPrimary }]}>{itemOfDay.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: theme.secondary }]}>
            <Text style={styles.categoryText}>{itemOfDay.categoryName}</Text>
          </View>
        </View>

        {itemOfDay.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {itemOfDay.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
                <Text style={[styles.tagText, { color: theme.secondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {!!itemOfDay.description && (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={10}>
            {itemOfDay.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={[styles.footerText, { color: theme.textMuted }]}>Today's featured item</Text>
        </View>
      </View>
    </View>
  )
}

export default ItemOfTheDay

const styles = StyleSheet.create({
  container: { padding: 20, marginBottom: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: -12,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  refreshButton: { padding: 8, borderRadius: 20 },
  card: { borderRadius: 12, padding: 16, borderLeftWidth: 4 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 12 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  categoryText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6, marginBottom: 4 },
  tagText: { fontSize: 12, fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 12, marginLeft: 4, fontStyle: 'italic' },
  emptyCard: { borderRadius: 12, padding: 32, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2 },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptySubtext: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  loadingText: { fontSize: 16, textAlign: 'center' },
})