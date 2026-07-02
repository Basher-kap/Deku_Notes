import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as DocumentPicker from 'expo-document-picker'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../context'

export default function ExportImportModal({ visible, onClose, onExport, onImport }) {
  const { theme } = useThemeContext()
  const [selectedFile, setSelectedFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try { await onExport() }
    catch (error) { Alert.alert('Error', 'Failed to export data.') }
    finally { setExporting(false) }
  }

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true })
      if (!result.canceled && result.assets?.length > 0) setSelectedFile(result.assets[0])
    } catch (error) { Alert.alert('Error', 'Failed to pick file.') }
  }

  const handleImport = async () => {
    if (!selectedFile) return
    setImporting(true)
    try {
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri)
      const data = JSON.parse(fileContent)
      onImport(data)
      Alert.alert('Success', 'Data imported successfully!')
      setSelectedFile(null)
      onClose()
    } catch (error) {
      Alert.alert('Error', 'Failed to import data. Please check if the file is a valid JSON format.')
    } finally { setImporting(false) }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Export / Import Data</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Export Your Data</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Export all your categories and items as a JSON file
            </Text>
            <TouchableOpacity style={[styles.btn, exporting && styles.disabled]} onPress={handleExport} disabled={exporting}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>{exporting ? 'Exporting...' : 'Export Data'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Import Data</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Import data from a previously exported JSON file
            </Text>
            <TouchableOpacity style={styles.btn} onPress={pickFile}>
              <Ionicons name="folder-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>Choose JSON File</Text>
            </TouchableOpacity>

            {selectedFile && (
              <View style={[styles.selectedFile, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.fileName, { color: theme.textPrimary }]} numberOfLines={1}>{selectedFile.name}</Text>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            )}

            {selectedFile && (
              <TouchableOpacity style={[styles.btn, styles.importBtn, importing && styles.disabled]} onPress={handleImport} disabled={importing}>
                <Ionicons name="cloud-download-outline" size={20} color="#fff" />
                <Text style={styles.btnText}>{importing ? 'Importing...' : 'Import Data'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxWidth: 400, borderRadius: 12, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: '600', marginBottom: 4, fontSize: 16 },
  description: { fontSize: 14, marginBottom: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4B0082', padding: 12, borderRadius: 8, justifyContent: 'center', marginTop: 8 },
  importBtn: { backgroundColor: '#4CAF50' },
  disabled: { opacity: 0.6 },
  btnText: { color: '#fff', marginLeft: 8, fontWeight: '600', fontSize: 14 },
  selectedFile: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 10, borderRadius: 6, borderWidth: 1, justifyContent: 'space-between' },
  fileName: { flex: 1, fontSize: 14 },
})