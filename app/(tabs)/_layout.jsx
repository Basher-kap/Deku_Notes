// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeContext } from '../../context/ThemeContext'

const TAB_CONFIG = {
  index: { label: 'Dashboard', icon: 'grid', iconOutline: 'grid-outline' },
  notes: { label: 'Notes', icon: 'document-text', iconOutline: 'document-text-outline' },
}

const LiquidGlassTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()
  const { isDark, theme } = useThemeContext()

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <View style={[
        styles.glassContainer,
        isDark ? styles.glassContainerDark : styles.glassContainerLight,
      ]}>

        <BlurView
          intensity={isDark ? 55 : 75}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        <View style={[
          styles.specularEdge,
          isDark ? styles.specularEdgeDark : styles.specularEdgeLight,
        ]} />

        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index
            const config = TAB_CONFIG[route.name] || {}

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={onPress}
                activeOpacity={0.7}
              >
                {isFocused && (
                  <View style={[
                    styles.activePill,
                    isDark ? styles.activePillDark : styles.activePillLight,
                  ]}>
                    <BlurView
                      intensity={isDark ? 30 : 50}
                      tint={isDark ? 'dark' : 'light'}
                      style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                    />
                    <View style={styles.pillSpecular} />
                  </View>
                )}

                <Ionicons
                  name={isFocused ? config.icon : config.iconOutline}
                  size={22}
                  color={
                    isFocused
                      ? theme.primary
                      : isDark
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(0,0,0,0.35)'
                  }
                />
                <Text style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.primary
                      : isDark
                        ? 'rgba(255,255,255,0.4)'
                        : 'rgba(0,0,0,0.35)',
                    fontWeight: isFocused ? '600' : '400',
                  }
                ]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

      </View>
    </View>
  )
}

export default function TabLayout() {
  const { theme } = useThemeContext()

  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.surface },
        headerTitleStyle: { fontSize: 20, color: theme.textPrimary },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', headerTitle: ' ' }}
      />
      <Tabs.Screen
        name="notes"
        options={{ title: 'Notes', headerTitle: ' ' }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 70,
  },
  glassContainer: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: {
      },
    }),
  },
  glassContainerLight: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  glassContainerDark: {
    backgroundColor: 'rgba(30,30,30,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  specularEdge: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    borderRadius: 1,
    zIndex: 10,
  },
  specularEdgeLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  specularEdgeDark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    gap: 3,
  },
  activePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 8,
    right: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activePillLight: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  activePillDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pillSpecular: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 1,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
})