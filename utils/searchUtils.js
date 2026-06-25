// utils/searchUtils.js

export const filterItems = (items, searchQuery) => {
  const query = searchQuery.trim().toLowerCase()
  if (!query) return items

  return items.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(query)
    const descMatch = item.description?.toLowerCase().includes(query)
    const tagMatch = Array.isArray(item.tags) &&
      item.tags.some((tag) => tag.toLowerCase().includes(query))
    return nameMatch || descMatch || tagMatch
  })
}