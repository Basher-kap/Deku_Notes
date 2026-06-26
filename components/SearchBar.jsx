import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../hooks/ThemeContext'

const SearchBar = ({ searchQuery, setSearchQuery, onClear }) => {
  const { theme } = useThemeContext()

  return (
    <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Ionicons name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: theme.textPrimary }]}
        placeholder="Search items..."
        placeholderTextColor={theme.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  clearButton: { marginLeft: 8 },
})