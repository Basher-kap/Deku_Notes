import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View, StyleSheet, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeContext } from '../../hooks/ThemeContext'
import { COLORS } from '../../constants'

const LiquidGlassTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()
  const { isDark } = useThemeContext()

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 12 }]}>
      {/* Outer glass container */}
      <View style={[styles.glassContainer, isDark && styles.glassContainerDark]}>

        {/* Blur layer */}
        <BlurView
          intensity={isDark ? 60 : 80}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Specular highlight — top edge shine */}
        <View style={styles.specularHighlight} />

        {/* Tab items */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]
            const isFocused = state.index === index

            const iconName = route.name === 'index'
              ? isFocused ? 'grid' : 'grid-outline'
              : isFocused ? 'document-text' : 'document-text-outline'

            const label = route.name === 'index' ? 'Dashboard' : 'Notes'

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name)
            }

            return (
              <View key={route.key} style={styles.tabItem}>
                {/* Active pill background */}
                {isFocused && (
                  <View style={[styles.activePill, isDark && styles.activePillDark]}>
                    <BlurView
                      intensity={isDark ? 40 : 60}
                      tint={isDark ? 'dark' : 'light'}
                      style={StyleSheet.absoluteFill}
                    />
                    {/* Pill specular */}
                    <View style={styles.pillSpecular} />
                  </View>
                )}

                {/* Icon + Label */}
                <View style={styles.tabContent} onTouchEnd={onPress}>
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={isFocused
                      ? COLORS.primary
                      : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'
                    }
                  />
                  <View
                    style={[
                      styles.labelWrapper,
                      isFocused && styles.labelWrapperVisible
                    ]}
                  >
                    {isFocused && (
                      <View style={[styles.labelText]}>
                        <Ionicons
                          name={iconName}
                          size={0}
                          color="transparent"
                        />
                        {/* We render a Text inline below */}
                      </View>
                    )}
                  </View>
                </View>

              </View>
            )
          })}
        </View>

      </View>
    </View>
  )
}