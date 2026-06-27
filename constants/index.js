// constants/index.js
export const STORAGE_KEY = 'deku_notes_data'
export const ITEM_OF_DAY_KEY = 'deku_item_of_day'
export const THEME_KEY = 'deku_theme'

export const COLORS = {
  primary:      '#4CAF50',
  secondary:    '#2196F3',
  accent:       '#9C27B0',
  warning:      '#FF9800',
  danger:       '#e74c3c',

  background:   '#f8f9fa',
  surface:      '#ffffff',

  textPrimary:  '#333333',
  textSecondary:'#666666',
  textMuted:    '#999999',

  border:       '#e0e0e0',
  sidebarBg:    '#2c2c2c',
  sidebarBorder:'#444444',
}

export const DARK_COLORS = {
  primary:      '#B350AF',
  secondary:    '#DE690C',
  accent:       '#63D84F',
  warning:      '#0067FF',
  danger:       '#EF5350',

  background:   '#121212',
  surface:      '#1e1e1e',

  textPrimary:  '#f0f0f0',
  textSecondary:'#aaaaaa',
  textMuted:    '#666666',

  border:       '#2e2e2e',
  sidebarBg:    '#1a1a1a',
  sidebarBorder:'#2e2e2e',
}

export const SORT_OPTIONS = [
  { key: 'alphabetical', label: 'A-Z',     icon: 'text-outline'     },
  { key: 'newest',       label: 'Newest',  icon: 'calendar-outline' },
  { key: 'oldest',       label: 'Oldest',  icon: 'calendar-outline' },
]

export const SIDEBAR_WIDTH = 250