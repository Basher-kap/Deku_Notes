// hooks/useDashboardStats.js
import { useMemo, useCallback } from 'react'

export const useDashboardStats = (categories) => {
  const totalItems = useMemo(
    () => (categories || []).reduce((sum, cat) => sum + cat.items.length, 0),
    [categories]
  )

  const totalCategories = categories?.length ?? 0

  // Kept for the pull-to-refresh animation delay in Dashboard
  const refreshStats = useCallback(
    () => new Promise((resolve) => setTimeout(resolve, 500)),
    []
  )

  return { totalItems, totalCategories, refreshStats }
}