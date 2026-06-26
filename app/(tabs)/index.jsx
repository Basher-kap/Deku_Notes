import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import StatisticsCard from '../../components/dashboard/StatisticsCard'
import ItemOfTheDay from '../../components/dashboard/ItemOfTheDay'
import CategoryPreview from '../../components/dashboard/CategoryPreview'
import { useCategories } from '../../hooks/useCategories'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useThemeContext } from '../../hooks/ThemeContext'
import { COLORS } from '../../constants'

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
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>Welcome back! 👋</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Here's what's happening with your notes
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatisticsCard title="Total Items" value={totalItems} icon="document-text" color={COLORS.primary} />
            <StatisticsCard title="Categories" value={totalCategories} icon="folder" color={COLORS.secondary} />
          </View>
        </View>

        <ItemOfTheDay categories={categories} />

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Category Previews</Text>
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No categories yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
                Create your first category to get started
              </Text>
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
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18 },
  scrollView: { flex: 1 },
  section: { padding: 20, marginBottom: 16 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  emptySubtext: { fontSize: 14, textAlign: 'center', marginTop: 4 },
  bottomSpacing: { height: 20 },
})