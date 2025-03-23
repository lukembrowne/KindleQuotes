import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getDailyQuote } from '../utils/quoteUtils';

const COLORS = {
  primary: '#2DD4BF', // Turquoise
  primaryDark: '#0D9488', // Darker turquoise for hover/press states
  text: '#333333',
  textLight: '#666666',
  textLighter: '#999999',
  background: '#FFFFFF',
  cardBackground: '#F8FAFC', // Light blue-gray
};

const HomeScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Quote of the Day</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : dailyQuote ? (
        <View style={styles.quoteContainer}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "{dailyQuote.Content}"
            </Text>
            <Text style={styles.quoteAuthor}>
              - {dailyQuote.BookAuthor}
            </Text>
            <Text style={styles.quoteBook}>
              {dailyQuote.BookTitle}
            </Text>
            <Text style={styles.quoteDate}>
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
          style={styles.button}
          onPress={() => navigation.navigate('AllQuotes')}
        >
          <Text style={styles.buttonText}>View All Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
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
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: COLORS.primary,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginTop: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quoteContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteCard: {
    backgroundColor: COLORS.cardBackground,
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
    color: COLORS.text,
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.text,
  },
  quoteBook: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  quoteDate: {
    fontSize: 12,
    color: COLORS.textLighter,
  },
  errorText: {
    color: '#EF4444', // Keeping error red for visibility
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen; 