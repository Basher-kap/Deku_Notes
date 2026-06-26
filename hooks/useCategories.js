// hooks/useCategories.js
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { generateId } from '../utils/dataManager'
import { STORAGE_KEY } from '../constants'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (!isLoading) saveData()
  }, [categories, isLoading])

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setCategories(parsed.categories || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ categories, savedAt: new Date().toISOString() })
      )
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  // Keeps selectedCategory in sync after any categories update
  const updateCategories = (updated) => {
    setCategories(updated)
    if (selectedCategory) {
      const stillSelected = updated.find((c) => c.id === selectedCategory.id)
      setSelectedCategory(stillSelected || null)
    }
  }

  const now = () => new Date().toISOString()

  // ─── category operations ──────────────────────────────────────────────────

  const addCategory = (name) => {
    if (!name.trim()) return
    setCategories((prev) => [
      {
        id: generateId(),
        name: name.trim(),
        items: [],
        sortOrder: 'alphabetical',
        createdAt: now(),
        updatedAt: now(),
      },
      ...prev,
    ])
  }

  const renameCategory = (categoryId, newName) => {
    if (!newName.trim()) return
    updateCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name: newName.trim(), updatedAt: now() } : cat
      )
    )
  }

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    if (selectedCategory?.id === id) setSelectedCategory(null)
  }

  const updateCategorySortOrder = (categoryId, sortOrder) => {
    updateCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, sortOrder, updatedAt: now() } : cat
      )
    )
  }

  // ─── item operations ──────────────────────────────────────────────────────

  const addItem = (item) => {
    if (!selectedCategory || !item.name.trim()) return
    const newItem = { ...item, id: generateId(), createdAt: now(), updatedAt: now() }
    updateCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, items: [...cat.items, newItem], updatedAt: now() }
          : cat
      )
    )
  }

  const editItem = (itemId, updatedItem) => {
    if (!selectedCategory) return
    updateCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? { ...item, ...updatedItem, id: itemId, updatedAt: now() }
                  : item
              ),
              updatedAt: now(),
            }
          : cat
      )
    )
  }

  const deleteItem = (itemId) => {
    if (!selectedCategory) return
    updateCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId), updatedAt: now() }
          : cat
      )
    )
  }

  // ─── data management ──────────────────────────────────────────────────────

  const importData = (data) => {
    setCategories(data.categories)
    setSelectedCategory(null)
  }

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
      setCategories([])
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  return {
    categories,
    selectedCategory,
    isLoading,
    setSelectedCategory,
    addCategory,
    renameCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
    updateCategorySortOrder,
    importData,
    clearAllData,
  }
}