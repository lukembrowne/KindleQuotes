import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme, Animated, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getDailyQuote } from '../utils/quoteUtils';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { loadQuotes } from '../utils/quoteUtils';

const HomeScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);

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
        console.log('Daily quote received:', quote);
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
    <LinearGradient
      colors={colors.gradient.background}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <Ionicons 
            name="sunny" 
            size={32} 
            color={colors.accent} 
            style={styles.headerIcon}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Today's Inspiration
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textLight }]}>
              Finding your perfect quote...
            </Text>
          </View>
        ) : error ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={[styles.errorTitle, { color: colors.error }]}>Oops!</Text>
            <Text style={[styles.errorText, { color: colors.textLight }]}>{error}</Text>
          </View>
        ) : dailyQuote ? (
          <View style={styles.quoteContainer}>
            <LinearGradient
              colors={colors.gradient.card}
              style={[styles.quoteCard, SHADOWS.lg]}
            >
              <View style={styles.quoteHeader}>
                <Ionicons name="chatbubble-ellipses" size={24} color={colors.accent} />
              </View>
              
              <Text 
                style={[styles.quoteText, { color: colors.text }]}
                numberOfLines={0}
              >
                {dailyQuote.Content}
              </Text>
              
              <View style={styles.quoteFooter}>
                <View style={styles.bookInfo}>
                  <Text style={[styles.quoteBook, { color: colors.text }]}>
                    {dailyQuote.BookTitle}
                  </Text>
                  <Text style={[styles.quoteAuthor, { color: colors.textLight }]}>
                    by {dailyQuote.BookAuthor}
                  </Text>
                </View>
                
                <View style={styles.dateContainer}>
                  <Text style={[styles.quoteDate, { color: colors.textLighter }]}>
                    {new Date(dailyQuote.CreatedKindle).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AllQuotes')}
            >
              <Ionicons name="library" size={20} color={colors.buttonText} />
              <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
                Explore All Quotes
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['4xl'],
    paddingTop: SPACING.lg,
  },
  headerIcon: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['6xl'],
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.base,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: SPACING['3xl'],
    borderRadius: BORDER_RADIUS.xl,
    margin: SPACING.lg,
    ...SHADOWS.md,
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
  quoteContainer: {
    width: '100%',
  },
  quoteCard: {
    padding: SPACING['3xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    marginBottom: SPACING['2xl'],
    width: '100%',
    flex: 1,
  },
  quoteHeader: {
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  quoteText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    lineHeight: 28,
    marginBottom: SPACING['2xl'],
    color: 'inherit',
    textAlign: 'left',
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: SPACING.lg,
  },
  bookInfo: {
    flex: 1,
  },
  quoteBook: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.xs,
  },
  quoteAuthor: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  quoteDate: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.md,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginLeft: SPACING.sm,
  },
});

export default HomeScreen; 