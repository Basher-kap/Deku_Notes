import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Modal, ScrollView, Image
} from 'react-native'
import React, { useMemo, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../context/ThemeContext'

const ItemModal = ({
  visible, onClose, itemName, setItemName,
  itemTags, setItemTags, itemDesc, setItemDesc,
  images, onPickImage, onRemoveImage,
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
        <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>

          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            {editingItem !== null ? 'Edit Item' : 'Add New Item'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Name */}
            <TextInput
              placeholder="Name"
              placeholderTextColor={theme.textMuted}
              value={itemName}
              onChangeText={setItemName}
              style={[styles.modalInput, {
                borderColor: theme.border,
                color: theme.textPrimary,
                backgroundColor: theme.background,
              }]}
            />

            {/* Tags row */}
            <View style={styles.tagsRow}>
              <TextInput
                placeholder="Tags (comma separated)"
                placeholderTextColor={theme.textMuted}
                value={itemTags}
                onChangeText={setItemTags}
                style={[styles.tagsInput, {
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  backgroundColor: theme.background,
                }]}
              />
              {existingTags.length > 0 && (
                <TouchableOpacity
                  style={[styles.tagDropdownBtn, {
                    backgroundColor: tagPickerOpen ? theme.accent : theme.primary,
                  }]}
                  onPress={() => setTagPickerOpen((prev) => !prev)}
                >
                  <Ionicons name={tagPickerOpen ? 'chevron-up' : 'pricetag-outline'} size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {/* Tag chips */}
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
                          isSelected(tag) && { backgroundColor: theme.primary, borderColor: theme.primary },
                        ]}
                        onPress={() => toggleTag(tag)}
                      >
                        {isSelected(tag) && (
                          <Ionicons name="checkmark" size={12} color="#fff" style={styles.tagCheckmark} />
                        )}
                        <Text style={[
                          styles.tagChipText,
                          { color: theme.textSecondary },
                          isSelected(tag) && { color: '#fff', fontWeight: '600' },
                        ]}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Description */}
            <TextInput
              placeholder="Description"
              placeholderTextColor={theme.textMuted}
              value={itemDesc}
              onChangeText={setItemDesc}
              style={[styles.modalInput, styles.descInput, {
                borderColor: theme.border,
                color: theme.textPrimary,
                backgroundColor: theme.background,
              }]}
              multiline
            />

            {/* Images section */}
            {(() => {
              const safeImages = Array.isArray(images) ? images : []
              console.log('ItemModal images prop:', images)
              return (
                <View style={styles.imagesSection}>
                  <View style={styles.imagesSectionHeader}>
                    <Text style={[styles.imagesLabel, { color: theme.textSecondary }]}>
                      Images ({safeImages.length}/5)
                    </Text>
                    {safeImages.length < 5 && (
                      <TouchableOpacity
                        style={[styles.addImageBtn, { backgroundColor: theme.secondary }]}
                        onPress={onPickImage}
                      >
                        <Ionicons name="image-outline" size={16} color="#fff" />
                        <Text style={styles.addImageText}>Add from Gallery</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {safeImages.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.thumbnailsRow}
                    >
                      {safeImages.map((uri, index) => (
                        <View key={index} style={styles.thumbnailWrapper}>
                          <Image
                            source={{ uri }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                            onError={(e) => console.log('image load error:', e.nativeEvent.error, uri)}
                          />
                          <TouchableOpacity
                            style={[styles.removeImageBtn, { backgroundColor: theme.danger }]}
                            onPress={() => onRemoveImage(uri)}
                          >
                            <Ionicons name="close" size={12} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )
            })()}

          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.btnText, { color: theme.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    maxHeight: '90%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: { borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10 },
  descInput: { height: 120, textAlignVertical: 'top' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  tagsInput: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 10 },
  tagDropdownBtn: {
    padding: 10, borderRadius: 6,
    justifyContent: 'center', alignItems: 'center',
    width: 42, height: 42,
  },
  tagPickerContainer: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 10 },
  tagPickerScroll: { maxHeight: 100 },
  tagPickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  tagCheckmark: { marginRight: 4 },
  tagChipText: { fontSize: 12 },
  // Images
  imagesSection: { marginBottom: 10 },
  imagesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagesLabel: { fontSize: 13, fontWeight: '500' },
  addImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addImageText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  thumbnailsRow: { flexDirection: 'row' },
  thumbnailWrapper: { position: 'relative', marginRight: 8 },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Actions
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  cancelBtn: { padding: 10, borderRadius: 6 },
  saveBtn: { padding: 10, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
})