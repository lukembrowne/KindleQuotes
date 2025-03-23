import quotesData from '../assets/quotes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTE_DATE_KEY = 'quoteOfTheDayDate';
const QUOTE_INDEX_KEY = 'quoteOfTheDayIndex';
const MAX_RETRIES = 3;

/**
 * Loads and parses the quotes from the bundled JSON file
 * @returns {Array} Array of quote objects
 * @throws {Error} If quotes cannot be loaded or parsed
 */
export const loadQuotes = () => {
  try {
    if (!quotesData || !Array.isArray(quotesData)) {
      throw new Error('Invalid quotes data format');
    }
    if (quotesData.length === 0) {
      throw new Error('No quotes available in the database');
    }
    return quotesData;
  } catch (error) {
    console.error('Error loading quotes:', error);
    throw new Error('Failed to load quotes. Please try again later.');
  }
};

/**
 * Gets a random quote index from the quotes array
 * @param {number} max - The maximum index (length of quotes array)
 * @returns {number} A random index between 0 and max-1
 */
const getRandomQuoteIndex = (max) => {
  return Math.floor(Math.random() * max);
};

/**
 * Validates a quote index
 * @param {number} index - The index to validate
 * @param {Array} quotes - The quotes array
 * @returns {boolean} Whether the index is valid
 */
const isValidQuoteIndex = (index, quotes) => {
  return index >= 0 && index < quotes.length;
};

/**
 * Gets the quote of the day, either from storage or by selecting a new one
 * @returns {Promise<Object>} The quote object for today
 * @throws {Error} If quotes cannot be loaded or if there's an error with AsyncStorage
 */
export const getDailyQuote = async () => {
  try {
    const quotes = loadQuotes();
    if (!quotes.length) {
      throw new Error('No quotes available');
    }

    // Get stored date and index
    const storedDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);
    const storedIndex = await AsyncStorage.getItem(QUOTE_INDEX_KEY);
    const today = new Date().toDateString();

    // If we have a stored quote for today, validate and return it
    if (storedDate === today && storedIndex !== null) {
      const index = parseInt(storedIndex, 10);
      if (isValidQuoteIndex(index, quotes)) {
        return quotes[index];
      }
    }

    // If we don't have a valid stored quote, select a new one
    let attempts = 0;
    let selectedIndex;
    let selectedQuote;

    while (attempts < MAX_RETRIES) {
      selectedIndex = getRandomQuoteIndex(quotes.length);
      if (isValidQuoteIndex(selectedIndex, quotes)) {
        selectedQuote = quotes[selectedIndex];
        break;
      }
      attempts++;
    }

    if (!selectedQuote) {
      throw new Error('Failed to select a valid quote after multiple attempts');
    }

    // Save the new selection
    await AsyncStorage.setItem(QUOTE_DATE_KEY, today);
    await AsyncStorage.setItem(QUOTE_INDEX_KEY, selectedIndex.toString());

    return selectedQuote;
  } catch (error) {
    console.error('Error in getDailyQuote:', error);
    throw new Error('Unable to get your daily quote. Please try again later.');
  }
}; 