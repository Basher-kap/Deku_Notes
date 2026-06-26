// hooks/useSearch.js
import { useState, useMemo } from 'react'
import { filterItems } from '../utils/searchUtils'
import { sortItems } from '../utils/sortUtils'   

export const useSearch = (selectedCategory, selectedTag = null) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedItems = useMemo(() => {
    if (!selectedCategory?.items) return []

    let items = selectedCategory.items

    if (selectedTag) {
      items = items.filter(
        (item) => Array.isArray(item.tags) && item.tags.includes(selectedTag)
      )
    }

    items = filterItems(items, searchQuery)
    items = sortItems(items, selectedCategory.sortOrder || 'alphabetical')

    return items
  }, [selectedCategory, searchQuery, selectedTag])

  const clearSearch = () => setSearchQuery('')

  return { searchQuery, setSearchQuery, filteredAndSortedItems, clearSearch }
}