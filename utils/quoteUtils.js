import quotesData from '../assets/quotes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTE_DATE_KEY = 'quoteOfTheDayDate';
const QUOTE_INDEX_KEY = 'quoteOfTheDayIndex';

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

    // If we have a stored quote for today, return it
    if (storedDate === today && storedIndex !== null) {
      const index = parseInt(storedIndex, 10);
      if (index >= 0 && index < quotes.length) {
        return quotes[index];
      }
    }

    // Select a new quote for today
    const newIndex = getRandomQuoteIndex(quotes.length);
    
    // Save the new selection
    await AsyncStorage.setItem(QUOTE_DATE_KEY, today);
    await AsyncStorage.setItem(QUOTE_INDEX_KEY, newIndex.toString());

    return quotes[newIndex];
  } catch (error) {
    console.error('Error getting daily quote:', error);
    throw new Error('Failed to get daily quote. Please try again later.');
  }
}; 