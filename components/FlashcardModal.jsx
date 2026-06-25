import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FlashcardModal = ({ visible, onClose, items, categoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    if (items && items.length > 0) {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [items, visible]);

  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const resetCards = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnimation.setValue(0);
  };

  const lastTap = React.useRef(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      flipCard();
      lastTap.current = null;
    } else {
      lastTap.current = now;
    }
  };

  if (!items || items.length === 0) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>No Flashcards Available</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.emptyText}>
              Add some items with descriptions to create flashcards!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const currentItem = shuffledItems[currentIndex];
  const frontRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{categoryName} Flashcards</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} of {shuffledItems.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentIndex + 1) / shuffledItems.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Flashcard */}
          <View style={styles.cardContainer}>
          <TouchableOpacity onPress={handleDoubleTap} style={styles.cardTouchable}>
              {/* Front of card (Description) */}
              <Animated.View 
                style={[
                  styles.card, 
                  styles.cardFront,
                  { transform: [{ rotateY: frontRotateY }] },
                  isFlipped && styles.cardHidden
                ]}
              >
                <Text style={styles.cardLabel}>Description</Text>
                <ScrollView
                  contentContainerStyle={styles.cardScroll}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.cardText}>
                    {currentItem?.description || 'No description available'}
                  </Text>
                </ScrollView>
                <Text style={styles.tapHint}>Double tap to reveal answer</Text>
              </Animated.View>

              {/* Back of card (Item Name) */}
              <Animated.View 
                style={[
                  styles.card, 
                  styles.cardBack,
                  { transform: [{ rotateY: backRotateY }] },
                  !isFlipped && styles.cardHidden
                ]}
              >
                <Text style={styles.cardLabel}>Answer</Text>
                <ScrollView
                  contentContainerStyle={styles.cardScroll}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.cardText}>{currentItem?.name}</Text>
                  {currentItem?.tags && currentItem.tags.length > 0 && (
                    <Text style={styles.tagsText}>
                      Tags: {currentItem.tags.join(', ')}
                    </Text>
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, currentIndex === 0 && styles.disabledButton]}
              onPress={prevCard}
              disabled={currentIndex === 0}
            >
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
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '95%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  cardTouchable: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 25, // Clean, predictable spacing to the buttons
    perspective: 1000,
    height: 320,      // Scaled up to comfortably accommodate text fields
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',   // Normalized back to 100% size of container
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  cardBack: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  cardHidden: {
    opacity: 0,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tagsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  tapHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  controlButton: {
    justifyContent: 'center', // Centers icon horizontally
    alignItems: 'center',     // Centers icon vertically
    backgroundColor: '#2196F3',
    paddingHorizontal: 14,    // Relaxed padding for balanced look
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 55,             // Matches the circular feel of adjacent buttons
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  disabledText: {
    color: '#ccc',
  },
  shuffleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 55,
  },
  startOverButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 55,
  },
  completionContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginTop: -60,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  restartText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FlashcardModal;