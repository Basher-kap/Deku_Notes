// hooks/useItemModal.js

import { useState } from 'react'

const EMPTY_FORM = { itemName: '', itemTags: '', itemDesc: '' }

export const useItemModal = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const setField = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const openModal = () => setModalVisible(true)

  const closeModal = () => {
    setModalVisible(false)
    setEditingItem(null)
    setForm(EMPTY_FORM)
  }

  const openEditModal = (item) => {
    setForm({
      itemName: item.name,
      itemTags: item.tags.join(', '),
      itemDesc: item.description,
    })
    setEditingItem(item)
    setModalVisible(true)
  }

  const getItemData = () => ({
    name: form.itemName,
    tags: form.itemTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    description: form.itemDesc,
  })

  return {
    modalVisible,
    itemName: form.itemName,
    setItemName: setField('itemName'),
    itemTags: form.itemTags,
    setItemTags: setField('itemTags'),
    itemDesc: form.itemDesc,
    setItemDesc: setField('itemDesc'),
    editingItem,
    openModal,
    closeModal,
    openEditModal,
    getItemData,
  }
}