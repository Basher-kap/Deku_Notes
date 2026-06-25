// components/dashboard/ItemOfTheDay.jsx

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ITEM_OF_DAY_KEY, COLORS } from '../../constants'

const getAllItems = (categories) =>
  categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.name }))
  )

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const ItemOfTheDay = ({ categories }) => {
  const [itemOfDay, setItemOfDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadItemOfDay() }, [categories])

  const saveNewItemOfDay = async (allItems) => {
    const item = pickRandom(allItems)
    await AsyncStorage.setItem(
      ITEM_OF_DAY_KEY,
      JSON.stringify({ date: new Date().toDateString(), item })
    )
    setItemOfDay(item)
  }

  const loadItemOfDay = async () => {
    try {
      const allItems = getAllItems(categories)
      if (allItems.length === 0) {
        setItemOfDay(null)
        return
      }

      const today = new Date().toDateString()
      const stored = await AsyncStorage.getItem(ITEM_OF_DAY_KEY)

      if (stored) {
        const { date, item } = JSON.parse(stored)
        if (date === today && allItems.find((i) => i.id === item.id)) {
          setItemOfDay(item)
          return
        }
      }

      await saveNewItemOfDay(allItems)
    } catch (error) {
      console.error('Error loading item of day:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshItemOfDay = async () => {
    const allItems = getAllItems(categories)
    if (allItems.length === 0) return
    try {
      await saveNewItemOfDay(allItems)
    } catch (error) {
      console.error('Error refreshing item of day:', error)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <View style={styles.card}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    )
  }

  if (!itemOfDay) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No items available</Text>
          <Text style={styles.emptySubtext}>Add some items to see your daily pick!</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Item of the Day</Text>
        <TouchableOpacity onPress={refreshItemOfDay} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{itemOfDay.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{itemOfDay.categoryName}</Text>
          </View>
        </View>

        {itemOfDay.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {itemOfDay.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {!!itemOfDay.description && (
          <Text style={styles.description} numberOfLines={10}>
            {itemOfDay.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.footerText}>Today's featured item</Text>
        </View>
      </View>
    </View>
  )
}

export default ItemOfTheDay

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: -12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})