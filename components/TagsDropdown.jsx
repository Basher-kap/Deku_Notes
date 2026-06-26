import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useState, useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../hooks/ThemeContext'

const TagsDropdown = ({ selectedCategory, selectedTag, onTagSelect }) => {
  const { theme } = useThemeContext()
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const uniqueTags = useMemo(() => {
    if (!selectedCategory?.items) return []
    const allTags = selectedCategory.items
      .filter((item) => item.tags && Array.isArray(item.tags) && item.tags.length > 0)
      .flatMap((item) => item.tags)
    return [...new Set(allTags)].sort()
  }, [selectedCategory])

  if (!selectedCategory || uniqueTags.length === 0) return null

  const handleTagSelect = (tag) => {
    onTagSelect(tag === selectedTag ? null : tag)
    setDropdownVisible(false)
  }

  const getDisplayText = () => (selectedTag ? `Tag: ${selectedTag}` : 'Filter by Tag')

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          selectedTag && styles.activeButton,
        ]}
        onPress={() => setDropdownVisible(true)}
      >
        <Ionicons name="pricetag-outline" size={18} color={selectedTag ? '#fff' : theme.textSecondary} />
        <Text style={[styles.dropdownText, { color: theme.textSecondary }, selectedTag && styles.activeText]}>
          {getDisplayText()}
        </Text>
        <Ionicons name="chevron-down" size={16} color={selectedTag ? '#fff' : theme.textSecondary} />
      </TouchableOpacity>

      <Modal visible={dropdownVisible} transparent={true} animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownVisible(false)}>
          <View style={[styles.dropdownModal, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Filter by Tag</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.tagItem, !selectedTag && styles.selectedTagItem]}
              onPress={() => handleTagSelect(null)}
            >
              <Ionicons name="close-circle-outline" size={16} color={!selectedTag ? '#fff' : theme.textSecondary} />
              <Text style={[styles.tagText, { color: theme.textPrimary }, !selectedTag && styles.selectedTagText]}>
                Show All
              </Text>
            </TouchableOpacity>

            <FlatList
              data={uniqueTags}
              keyExtractor={(item) => item}
              style={styles.tagsList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.tagItem, selectedTag === item && styles.selectedTagItem]}
                  onPress={() => handleTagSelect(item)}
                >
                  <Ionicons name="pricetag" size={16} color={selectedTag === item ? '#fff' : '#4CAF50'} />
                  <Text style={[styles.tagText, { color: theme.textPrimary }, selectedTag === item && styles.selectedTagText]}>
                    {item}
                  </Text>
                  {selectedTag === item && <Ionicons name="checkmark" size={16} color="#fff" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default TagsDropdown

const styles = StyleSheet.create({
  container: { marginHorizontal: 12, marginBottom: 8 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignSelf: 'flex-start', maxWidth: 200 },
  activeButton: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  dropdownText: { marginLeft: 6, marginRight: 6, fontWeight: '500', fontSize: 14, flexShrink: 1 },
  activeText: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownModal: { borderRadius: 12, padding: 16, width: '80%', maxWidth: 300, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1 },
  modalTitle: { fontSize: 16, fontWeight: 'bold' },
  tagsList: { maxHeight: 200 },
  tagItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 6, marginBottom: 4, minHeight: 44 },
  selectedTagItem: { backgroundColor: '#4CAF50' },
  tagText: { marginLeft: 8, fontSize: 14, flex: 1 },
  selectedTagText: { color: '#fff', fontWeight: '500' },
})