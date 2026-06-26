import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  LayoutAnimation, Platform, UIManager
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../hooks/ThemeContext'
import { COLORS } from '../constants'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const TagChip = ({ tag, theme }) => (
  <View style={[styles.tagChip, { backgroundColor: theme.surface, borderColor: COLORS.secondary }]}>
    <Text style={styles.tagText}>{tag}</Text>
  </View>
)

const ItemRow = ({ item, expanded, onToggle, onEdit, onDelete, theme }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
    <View style={[styles.itemBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.itemName, { color: theme.textPrimary }]}>{item.name}</Text>
      {expanded && (
        <View style={styles.itemDetails}>
          {item.tags?.length > 0 && (
            <View style={styles.tagsWrapper}>
              {item.tags.map((tag, i) => (
                <TagChip key={i} tag={tag} theme={theme} />
              ))}
            </View>
          )}
          {!!item.description && (
            <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          )}
          <View style={styles.itemActions}>
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.editBtn}>
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </TouchableOpacity>
)

const ItemList = ({ items, selectedCategory, expandedIndex, setExpandedIndex, onEditItem, onDeleteItem }) => {
  const { theme } = useThemeContext()

  const toggleExpand = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedIndex(expandedIndex === itemId ? null : itemId)
  }

  if (!selectedCategory) {
    return <Text style={[styles.hint, { color: theme.textSecondary }]}>Select a category to view items.</Text>
  }

  if (items.length === 0) {
    return <Text style={[styles.hint, { color: theme.textSecondary }]}>No items found.</Text>
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemRow
          item={item}
          expanded={expandedIndex === item.id}
          onToggle={() => toggleExpand(item.id)}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          theme={theme}
        />
      )}
    />
  )
}

export default ItemList

const styles = StyleSheet.create({
  hint: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  itemBox: { padding: 10, marginVertical: 6, borderRadius: 6, borderWidth: 1 },
  itemName: { fontWeight: 'bold', fontSize: 16, padding: 3 },
  itemDetails: { marginTop: 6 },
  tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tagChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 11, color: '#1976d2', fontWeight: '500' },
  itemDescription: { fontSize: 14, marginTop: 4 },
  itemActions: { flexDirection: 'row', marginTop: 8, gap: 5, alignSelf: 'flex-end' },
  editBtn: { backgroundColor: '#4a90e2', padding: 6, borderRadius: 6 },
  deleteBtn: { backgroundColor: COLORS.danger, padding: 6, borderRadius: 6 },
})