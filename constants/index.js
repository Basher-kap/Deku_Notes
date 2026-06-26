// constants/index.js
export const STORAGE_KEY = 'deku_notes_data'
export const ITEM_OF_DAY_KEY = 'deku_item_of_day'
export const THEME_KEY = 'deku_theme'

// ─── Light theme ─────────────────────────────────────────────────────────────
export const COLORS = {
  primary:       '#4CAF50',   // green
  secondary:     '#2196F3',   // blue
  accent:        '#9C27B0',   // purple
  warning:       '#FF9800',   // orange
  danger:        '#e74c3c',   // red

  background:    '#f8f9fa',
  surface:       '#ffffff',

  textPrimary:   '#333333',
  textSecondary: '#666666',
  textMuted:     '#999999',

  border:        '#e0e0e0',
  sidebarBg:     '#2c2c2c',
  sidebarBorder: '#444444',
}

// ─── Dark theme ───────────────────────────────────────────────────────────────
// Brand colors are lightened/desaturated so they stay readable on dark surfaces
// without being too harsh or vibrant
export const DARK_COLORS = {
  primary:       '#66BB6A',   // lighter green — still recognizable, softer glow
  secondary:     '#42A5F5',   // lifted blue — easier on dark bg
  accent:        '#CE93D8',   // light purple — purple gets muddy when dark, lift it
  warning:       '#FFA726',   // soft orange — slightly muted from the light version
  danger:        '#EF5350',   // brighter red — ensures it stays alarming on dark

  background:    '#121212',   // Material dark standard
  surface:       '#1e1e1e',   // Cards, modals, sheets

  textPrimary:   '#f0f0f0',   // Near-white — pure white is too harsh
  textSecondary: '#aaaaaa',   // Mid grey
  textMuted:     '#666666',   // Dimmer grey for hints/placeholders

  border:        '#2e2e2e',   // Very subtle — just enough to define edges
  sidebarBg:     '#1a1a1a',   // Slightly deeper than surface
  sidebarBorder: '#2e2e2e',
}

export const SORT_OPTIONS = [
  { key: 'alphabetical', label: 'A-Z',     icon: 'text-outline'     },
  { key: 'newest',       label: 'Newest',  icon: 'calendar-outline' },
  { key: 'oldest',       label: 'Oldest',  icon: 'calendar-outline' },
]

export const SIDEBAR_WIDTH = 250