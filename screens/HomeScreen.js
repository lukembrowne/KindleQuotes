import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { getDailyQuote } from '../utils/quoteUtils';
import { COLORS } from '../utils/constants';
import { loadQuotes } from '../utils/quoteUtils';

const HomeScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      console.log('Fetching quote...');
      try {
        // If we have a quote from the notification, use that
        if (route.params?.quoteId) {
          console.log('Notification quote ID received:', route.params.quoteId);
          const allQuotes = await loadQuotes();
          console.log('Total quotes loaded:', allQuotes.length);
          const notificationQuote = allQuotes.find(q => q.id === route.params.quoteId);
          console.log('Found notification quote:', notificationQuote ? 'Yes' : 'No');
          if (notificationQuote) {
            console.log('Setting quote from notification:', notificationQuote.Content.substring(0, 50) + '...');
            setDailyQuote(notificationQuote);
            setLoading(false);
            return;
          }
        } else if (route.params?.quote) {
          // If we have the quote content directly from notification
          console.log('Direct quote received from notification');
          const allQuotes = await loadQuotes();
          const notificationQuote = allQuotes.find(q => q.Content === route.params.quote);
          if (notificationQuote) {
            console.log('Found matching quote:', notificationQuote.Content.substring(0, 50) + '...');
            setDailyQuote(notificationQuote);
            setLoading(false);
            return;
          }
        }
        
        // Otherwise, get the daily quote
        console.log('No notification quote found, getting daily quote');
        const quote = await getDailyQuote();
        setDailyQuote(quote);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error in HomeScreen:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [route.params?.quoteId, route.params?.quote]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Quote of the Day</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : dailyQuote ? (
        <View style={styles.quoteContainer}>
          <View style={[styles.quoteCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.quoteText, { color: colors.text }]}>
              "{dailyQuote.Content}"
            </Text>
            <Text style={[styles.quoteBook, { color: colors.text }]}>
              {dailyQuote.BookTitle}
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.textLight }]}>
              by {dailyQuote.BookAuthor}
            </Text>
            <Text style={[styles.quoteDate, { color: colors.textLighter }]}>
              {new Date(dailyQuote.CreatedKindle).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginTop: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quoteContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteCard: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
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
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen; 