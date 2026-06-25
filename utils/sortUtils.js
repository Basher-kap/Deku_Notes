// utils/sortUtils.js

const naturalSort = (a, b) => {
  const ax = []
  const bx = []

  a.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    ax.push([num || Infinity, str || ''])
  })
  b.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    bx.push([num || Infinity, str || ''])
  })

  while (ax.length && bx.length) {
    const an = ax.shift()
    const bn = bx.shift()
    const nn = an[0] - bn[0] || an[1].localeCompare(bn[1])
    if (nn) return nn
  }
  return ax.length - bx.length
}

export const sortItems = (items, sortOrder = 'alphabetical') => {
  if (!items || items.length === 0) return []
  const copy = [...items]

  switch (sortOrder) {
    case 'alphabetical':
      return copy.sort((a, b) => naturalSort(a.name, b.name))
    case 'newest':
      return copy.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    case 'oldest':
      return copy.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    default:
      return copy
  }
}