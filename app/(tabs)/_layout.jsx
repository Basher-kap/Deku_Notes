import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeContext } from '../../hooks/ThemeContext'
import { COLORS } from '../../constants'

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const { theme } = useThemeContext()

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerStyle: {
          height: 70,
          backgroundColor: theme.surface,
        },
        headerTitleStyle: {
          fontSize: 20,
          color: theme.textPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: ' ',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          headerTitle: ' ',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}