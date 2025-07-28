import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, useColorScheme, TextInput, TouchableOpacity, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loadQuotes } from '../utils/quoteUtils';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

const QuoteItem = ({ quote, colors, index }) => {
  const fadeAnim = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <LinearGradient
        colors={colors.gradient.card}
        style={[styles.quoteCard, SHADOWS.md]}
      >
        <View style={styles.quoteHeader}>
          <Ionicons name="chatbubble-ellipses" size={16} color={colors.accent} />
        </View>
        
        <Text 
          style={[styles.quoteText, { color: colors.text }]}
          numberOfLines={0}
        >
          {quote.Content}
        </Text>
        
        <View style={styles.quoteFooter}>
          <View style={styles.bookInfo}>
            <Text style={[styles.quoteBook, { color: colors.text }]}>
              {quote.BookTitle}
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.textLight }]}>
              by {quote.BookAuthor}
            </Text>
          </View>
          
          <Text style={[styles.quoteDate, { color: colors.textLighter }]}>
            {new Date(quote.CreatedKindle).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const AllQuotesScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('book'); // 'book', 'author', 'date'

  const filteredAndSortedQuotes = useMemo(() => {
    let filtered = quotes;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = quotes.filter(quote => 
        quote.Content.toLowerCase().includes(query) ||
        quote.BookTitle.toLowerCase().includes(query) ||
        quote.BookAuthor.toLowerCase().includes(query)
      );
    }
    
    // Sort quotes
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.BookAuthor.localeCompare(b.BookAuthor);
        case 'date':
          return new Date(b.CreatedKindle) - new Date(a.CreatedKindle);
        case 'book':
        default:
          return a.BookTitle.localeCompare(b.BookTitle);
      }
    });
    
    return sorted;
  }, [quotes, searchQuery, sortBy]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setQuotes(loadedQuotes);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading quotes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const renderSortButton = (value, label, icon) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        { backgroundColor: sortBy === value ? colors.primary : colors.cardBackground },
        SHADOWS.sm
      ]}
      onPress={() => setSortBy(value)}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={sortBy === value ? colors.buttonText : colors.textLight} 
      />
      <Text style={[
        styles.sortButtonText,
        { color: sortBy === value ? colors.buttonText : colors.textLight }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={colors.gradient.background} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>
            Loading your quotes...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={colors.gradient.background} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.error }]}>Error</Text>
          <Text style={[styles.errorText, { color: colors.textLight }]}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradient.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search quotes, books, or authors..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.textLight }]}>Sort by:</Text>
          <View style={styles.sortButtons}>
            {renderSortButton('book', 'Book', 'book')}
            {renderSortButton('author', 'Author', 'person')}
            {renderSortButton('date', 'Date', 'calendar')}
          </View>
        </View>
        
        <Text style={[styles.resultsCount, { color: colors.textLight }]}>
          {filteredAndSortedQuotes.length} quote{filteredAndSortedQuotes.length !== 1 ? 's' : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </Text>
      </View>

      <FlatList
        data={filteredAndSortedQuotes}
        renderItem={({ item, index }) => (
          <QuoteItem quote={item} colors={colors} index={index} />
        )}
        keyExtractor={(item, index) => `${item.BookTitle}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING['3xl'],
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.sizes['2xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.base,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.relaxed,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  sortContainer: {
    marginBottom: SPACING.md,
  },
  sortLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginBottom: SPACING.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  sortButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  quoteCard: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  quoteHeader: {
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  quoteText: {
    fontSize: TYPOGRAPHY.sizes.base,
    lineHeight: 24,
    marginBottom: SPACING.lg,
    color: 'inherit',
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: SPACING.md,
  },
  bookInfo: {
    flex: 1,
  },
  quoteBook: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.xs,
  },
  quoteAuthor: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  quoteDate: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  separator: {
    height: SPACING.sm,
  },
});

export default AllQuotesScreen; 