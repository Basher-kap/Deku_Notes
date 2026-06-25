// components/ItemList.jsx

import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
  LayoutAnimation, Platform, UIManager
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const TagChip = ({ tag }) => (
  <View style={styles.tagChip}>
    <Text style={styles.tagText}>{tag}</Text>
  </View>
)

const ItemRow = ({ item, expanded, onToggle, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
    <View style={styles.itemBox}>
      <Text style={styles.itemName}>{item.name}</Text>
      {expanded && (
        <View style={styles.itemDetails}>
          {item.tags?.length > 0 && (
            <View style={styles.tagsWrapper}>
              {item.tags.map((tag, i) => (
                <TagChip key={i} tag={tag} />
              ))}
            </View>
          )}
          {!!item.description && (
            <Text style={styles.itemDescription}>{item.description}</Text>
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

const ItemList = ({
  items,
  selectedCategory,
  expandedIndex,
  setExpandedIndex,
  onEditItem,
  onDeleteItem,
}) => {
  const toggleExpand = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedIndex(expandedIndex === itemId ? null : itemId)
  }

  if (!selectedCategory) {
    return <Text style={styles.hint}>Select a category to view items.</Text>
  }

  if (items.length === 0) {
    return <Text style={styles.hint}>No items found.</Text>
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
        />
      )}
    />
  )
}

export default ItemList

const styles = StyleSheet.create({
  hint: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  itemBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 3,
    color: COLORS.textPrimary,
  },
  itemDetails: {
    marginTop: 6,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  tagChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  tagText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 5,
    alignSelf: 'flex-end',
  },
  editBtn: {
    backgroundColor: '#4a90e2',
    padding: 6,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: COLORS.danger,
    padding: 6,
    borderRadius: 6,
  },
})