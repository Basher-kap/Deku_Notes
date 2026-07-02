import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../context'

const FlashcardModal = ({ visible, onClose, items, categoryName }) => {
  const { theme, isDark } = useThemeContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [flipAnimation] = useState(new Animated.Value(0))
  const [shuffledItems, setShuffledItems] = useState([])
  const lastTap = React.useRef(null)

  useEffect(() => {
    if (items && items.length > 0) {
      setShuffledItems([...items].sort(() => Math.random() - 0.5))
      setCurrentIndex(0)
      setIsFlipped(false)
    }
  }, [items, visible])

  const flipCard = () => {
    Animated.timing(flipAnimation, { toValue: isFlipped ? 0 : 1, duration: 300, useNativeDriver: true }).start()
    setIsFlipped(!isFlipped)
  }

  const handleDoubleTap = () => {
    const now = Date.now()
    if (lastTap.current && now - lastTap.current < 300) { flipCard(); lastTap.current = null }
    else { lastTap.current = now }
  }

  const nextCard = () => {
    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(currentIndex + 1); setIsFlipped(false); flipAnimation.setValue(0)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); setIsFlipped(false); flipAnimation.setValue(0)
    }
  }

  const resetCards = () => {
    setShuffledItems([...items].sort(() => Math.random() - 0.5))
    setCurrentIndex(0); setIsFlipped(false); flipAnimation.setValue(0)
  }

  if (!items || items.length === 0) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: theme.surface }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>No Flashcards Available</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Add some items with descriptions to create flashcards!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const currentItem = shuffledItems[currentIndex]
  const frontRotateY = flipAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const backRotateY = flipAnimation.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })

  const dynamicCardFront = {
    backgroundColor: isDark ? '#1a2a3a' : '#e3f2fd',
    borderColor: isDark ? '#42A5F5' : '#2196F3',
  }

  const dynamicCardBack = {
    backgroundColor: isDark ? '#1a2e1a' : '#e8f5e8',
    borderColor: isDark ? '#66BB6A' : '#4CAF50',
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.surface }]}>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{categoryName} Flashcards</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {currentIndex + 1} of {shuffledItems.length}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { width: `${((currentIndex + 1) / shuffledItems.length) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={handleDoubleTap} style={styles.cardTouchable}>
              <Animated.View style={[styles.card, dynamicCardFront, { transform: [{ rotateY: frontRotateY }] }, isFlipped && styles.cardHidden]}>
                <Text style={styles.cardLabel}>Description</Text>
                <ScrollView contentContainerStyle={styles.cardScroll} showsVerticalScrollIndicator={false}>
                  <Text style={[styles.cardText, { color: theme.textPrimary }]}>{currentItem?.description || 'No description available'}</Text>
                </ScrollView>
                <Text style={[styles.tapHint, { color: theme.textMuted }]}>Double tap to reveal answer</Text>
              </Animated.View>

              <Animated.View style={[styles.card, dynamicCardBack, { transform: [{ rotateY: backRotateY }] }, !isFlipped && styles.cardHidden]}>
                <Text style={styles.cardLabel}>Answer</Text>
                <ScrollView contentContainerStyle={styles.cardScroll} showsVerticalScrollIndicator={false}>
                  <Text style={[styles.cardText, { color: theme.textPrimary }]}>{currentItem?.name}</Text>
                  {currentItem?.tags?.length > 0 && (
                    <Text style={[styles.tagsText, { color: theme.textMuted }]}>
                      Tags: {currentItem.tags.join(', ')}
                    </Text>
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={[styles.controlButton, currentIndex === 0 && styles.disabledButton]} onPress={prevCard} disabled={currentIndex === 0}>
              <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? '#ccc' : '#fff'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shuffleButton} onPress={resetCards}>
              <Ionicons name="shuffle" size={20} color="#fff" />
            </TouchableOpacity>

            {currentIndex === shuffledItems.length - 1 ? (
              <TouchableOpacity style={styles.startOverButton} onPress={resetCards}>
                <Ionicons name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.controlButton} onPress={nextCard}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
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
  modal: { width: '95%', maxWidth: 400, borderRadius: 16, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  progressContainer: { marginBottom: 20 },
  progressText: { textAlign: 'center', fontSize: 16, marginBottom: 8 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 2 },
  cardContainer: { marginBottom: 25, height: 320 },
  cardTouchable: { flex: 1 },
  card: { position: 'absolute', width: '100%', height: '100%', borderRadius: 12, padding: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, backfaceVisibility: 'hidden' },
  cardHidden: { opacity: 0 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  cardScroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 4 },
  cardText: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 24 },
  tagsText: { fontSize: 12, marginTop: 10, fontStyle: 'italic' },
  tapHint: { fontSize: 12, marginTop: 10, fontStyle: 'italic' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 5 },
  controlButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#2196F3', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, minWidth: 55 },
  disabledButton: { backgroundColor: '#e0e0e0' },
  shuffleButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF9800', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, minWidth: 55 },
  startOverButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, minWidth: 55 },
  emptyText: { fontSize: 16, textAlign: 'center', marginVertical: 20 },
  closeButton: { backgroundColor: '#2196F3', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, alignSelf: 'center' },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
})

export default FlashcardModal