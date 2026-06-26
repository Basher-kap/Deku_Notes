// app/(tabs)/index.jsx

import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import StatisticsCard from '../../components/dashboard/StatisticsCard'
import ItemOfTheDay from '../../components/dashboard/ItemOfTheDay'
import CategoryPreview from '../../components/dashboard/CategoryPreview'
import { useCategories } from '../../hooks/useCategories'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { COLORS } from '../../constants'
import { useThemeContext } from '../../context/ThemeContext'

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false)

  const { categories, isLoading } = useCategories()
  const { totalItems, totalCategories, refreshStats } = useDashboardStats(categories)
  const { theme } = useThemeContext()


  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshStats()
    setRefreshing(false)
  }, [refreshStats])

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.section}>
          <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>Welcome back! 👋</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textPrimary }]}>Here's what's happening with your notes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard title="Total Items" value={totalItems} icon="document-text" color={COLORS.primary} />
            <StatisticsCard title="Categories" value={totalCategories} icon="folder" color={COLORS.secondary} />
          </View>
        </View>

        <ItemOfTheDay categories={categories} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Previews</Text>
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No categories yet</Text>
              <Text style={styles.emptySubtext}>Create your first category to get started</Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.slice(0, 4).map((category) => (
                <CategoryPreview key={category.id} category={category} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  scrollView: { flex: 1 },
  section: {
    padding: 20,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
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
  bottomSpacing: { height: 20 },
})