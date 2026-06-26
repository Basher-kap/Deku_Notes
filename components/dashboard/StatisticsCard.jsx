import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../context/ThemeContext'

const StatisticsCard = ({ title, value, icon, color, subtitle, onPress }) => {
  const { theme } = useThemeContext()
  const CardComponent = onPress ? TouchableOpacity : View

  return (
    <CardComponent style={[styles.card, { backgroundColor: theme.surface, borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>{title}</Text>
        </View>
        <Text style={[styles.cardValue, { color }]}>{value}</Text>
        {subtitle && <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
      </View>
    </CardComponent>
  )
}

export default StatisticsCard

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 12, width: '48%', borderLeftWidth: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 14, marginLeft: 8, fontWeight: '500' },
  cardValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, fontStyle: 'italic' },
})