import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, useColorScheme } from 'react-native';
import { loadQuotes } from '../utils/quoteUtils';
import { COLORS } from '../utils/constants';

const QuoteItem = ({ quote, colors }) => (
  <View style={[styles.quoteCard, { backgroundColor: colors.cardBackground }]}>
    <Text style={[styles.quoteText, { color: colors.text }]}>
      "{quote.Content}"
    </Text>
    <Text style={[styles.quoteBook, { color: colors.text }]}>
      {quote.BookTitle}
    </Text>
    <Text style={[styles.quoteAuthor, { color: colors.textLight }]}>
      by {quote.BookAuthor}
    </Text>
    <Text style={[styles.quoteDate, { color: colors.textLighter }]}>
      {new Date(quote.CreatedKindle).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </Text>
  </View>
);

const AllQuotesScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = loadQuotes();
        // Sort quotes alphabetically by BookTitle
        const sortedQuotes = [...loadedQuotes].sort((a, b) => 
          a.BookTitle.localeCompare(b.BookTitle)
        );
        setQuotes(sortedQuotes);
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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={quotes}
        renderItem={({ item }) => <QuoteItem quote={item} colors={colors} />}
        keyExtractor={(item, index) => `${item.BookTitle}-${index}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.separator }]} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  quoteCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 24,
  },
  quoteBook: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quoteAuthor: {
    fontSize: 14,
    marginBottom: 10,
  },
  quoteDate: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default AllQuotesScreen; 