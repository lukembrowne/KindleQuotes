import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { getDailyQuote } from '../utils/quoteUtils';

const COLORS = {
  light: {
    primary: '#2DD4BF',
    primaryDark: '#0D9488',
    text: '#333333',
    textLight: '#666666',
    textLighter: '#999999',
    background: '#FFFFFF',
    cardBackground: '#F8FAFC',
    buttonText: '#FFFFFF',
    error: '#EF4444',
  },
  dark: {
    primary: '#2DD4BF',
    primaryDark: '#0D9488',
    text: '#E5E7EB',
    textLight: '#9CA3AF',
    textLighter: '#6B7280',
    background: '#1F2937',
    cardBackground: '#374151',
    buttonText: '#FFFFFF',
    error: '#F87171',
  },
};

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
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

    fetchDailyQuote();
  }, []);

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
            <Text style={[styles.quoteAuthor, { color: colors.text }]}>
              - {dailyQuote.BookAuthor}
            </Text>
            <Text style={[styles.quoteBook, { color: colors.textLight }]}>
              {dailyQuote.BookTitle}
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AllQuotes')}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>View All Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Settings</Text>
        </TouchableOpacity>
      </View>
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
  quoteAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quoteBook: {
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