import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../hooks/ThemeContext'

const ItemModal = ({
  visible, onClose, itemName, setItemName,
  itemTags, setItemTags, itemDesc, setItemDesc,
  onSave, editingItem, selectedCategory,
}) => {
  const { theme } = useThemeContext()
  const [tagPickerOpen, setTagPickerOpen] = useState(false)

  const existingTags = useMemo(() => {
    if (!selectedCategory?.items) return []
    const all = selectedCategory.items.flatMap((item) => item.tags || [])
    return [...new Set(all)].sort()
  }, [selectedCategory])

  const selectedTags = useMemo(() => {
    return itemTags.split(',').map((t) => t.trim()).filter(Boolean)
  }, [itemTags])

  const toggleTag = (tag) => {
    const current = new Set(selectedTags)
    if (current.has(tag)) { current.delete(tag) } else { current.add(tag) }
    setItemTags([...current].join(', '))
  }

  const isSelected = (tag) => selectedTags.includes(tag)

  const handleClose = () => { setTagPickerOpen(false); onClose() }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            {editingItem !== null ? 'Edit Item' : 'Add New Item'}
          </Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor={theme.textMuted}
            value={itemName}
            onChangeText={setItemName}
            style={[styles.modalInput, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
          />

          <View style={styles.tagsRow}>
            <TextInput
              placeholder="Tags (comma separated)"
              placeholderTextColor={theme.textMuted}
              value={itemTags}
              onChangeText={setItemTags}
              style={[styles.tagsInput, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
            />
            {existingTags.length > 0 && (
              <TouchableOpacity
                style={[styles.tagDropdownBtn, tagPickerOpen && styles.tagDropdownBtnActive]}
                onPress={() => setTagPickerOpen((prev) => !prev)}
              >
                <Ionicons name={tagPickerOpen ? 'chevron-up' : 'pricetag-outline'} size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {tagPickerOpen && (
            <View style={[styles.tagPickerContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <ScrollView style={styles.tagPickerScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.tagPickerGrid}>
                  {existingTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagChip,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        isSelected(tag) && styles.tagChipSelected,
                      ]}
                      onPress={() => toggleTag(tag)}
                    >
                      {isSelected(tag) && (
                        <Ionicons name="checkmark" size={12} color="#fff" style={styles.tagCheckmark} />
                      )}
                      <Text style={[styles.tagChipText, { color: theme.textSecondary }, isSelected(tag) && styles.tagChipTextSelected]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <TextInput
            placeholder="Description"
            placeholderTextColor={theme.textMuted}
            value={itemDesc}
            onChangeText={setItemDesc}
            style={[styles.modalInput, styles.descInput, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
            multiline
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ItemModal

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '90%', padding: 15, borderRadius: 10, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10 },
  descInput: { height: 160, textAlignVertical: 'top' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  tagsInput: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 10 },
  tagDropdownBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center', width: 42, height: 42 },
  tagDropdownBtnActive: { backgroundColor: '#388E3C' },
  tagPickerContainer: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 10 },
  tagPickerScroll: { maxHeight: 100 },
  tagPickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  tagChipSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  tagCheckmark: { marginRight: 4 },
  tagChipText: { fontSize: 12 },
  tagChipTextSelected: { color: '#fff', fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { backgroundColor: '#aaa', padding: 10, borderRadius: 6, marginRight: 10 },
  saveBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
})