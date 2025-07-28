import quotesData from '../assets/quotes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, MAX_RETRIES } from './constants';

/**
 * Parses a Kindle highlights text file into an array of quote objects
 * @param {string} text - The raw text from the Kindle highlights file
 * @returns {Array} Array of quote objects
 */
export const parseKindleHighlights = (text) => {
  try {
    // Split the text into individual highlights
    const highlights = text.split('==========').filter(h => h.trim());
    console.log('Parsing highlights...');
    
    return highlights.map((highlight, index) => {
      try {
        // Split into lines and filter empty ones
        const lines = highlight.split('\n').filter(line => line.trim());
        console.log(`\nProcessing highlight ${index + 1}:`);
        console.log('Lines found:', lines.length);
        console.log('Lines:', lines);
        
        if (lines.length < 3) {
          console.error('Invalid highlight format - missing quote or metadata');
          throw new Error('Invalid highlight format - missing quote or metadata');
        }

        // First line is book title and author
        const bookLine = lines[0];
        const bookMatch = bookLine.match(/(.*?) \((.*?)\)/);
        if (!bookMatch) {
          console.error('Failed to parse book line:', bookLine);
          throw new Error('Invalid book format');
        }
        const [, bookTitle, bookAuthor] = bookMatch;

        // Second line is metadata - handle potential line breaks in the date
        const metadataLine = lines[1];
        const metadataMatch = metadataLine.match(/- Your Highlight on (?:page ([0-9xiv]+) \| )?Location (\d+-\d+) \| Added on (.*)/);
        if (!metadataMatch) {
          console.error('Failed to parse metadata line:', metadataLine);
          throw new Error('Invalid metadata format');
        }
        const [, page, location, dateStr] = metadataMatch;

        // If the date string is incomplete, try to get the rest from the next line
        let fullDateStr = dateStr;
        console.log('Full date string:', fullDateStr);

        // Parse the date string
        // Remove the day name and clean up the format
        const cleanDateStr = fullDateStr
          .replace(/^[A-Za-z]+,?\s*/, '') // Remove day name and comma
          .replace(/, /g, ' '); // Remove remaining commas
        console.log('Cleaned date string:', cleanDateStr);
        
        // Parse the date components
        const dateMatch = cleanDateStr.match(/([A-Za-z]+) (\d+) (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);
        if (!dateMatch) {
          console.error('Failed to match date components:', cleanDateStr);
          throw new Error('Invalid date format');
        }

        const [, month, day, year, hours, minutes, seconds, ampm] = dateMatch;
        
        // Convert month name to number (0-11)
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = monthNames.indexOf(month);
        if (monthIndex === -1) {
          console.error('Invalid month:', month);
          throw new Error('Invalid month in date');
        }

        // Create date with numeric components
        const date = new Date(
          parseInt(year),
          monthIndex,
          parseInt(day),
          parseInt(hours) + (ampm === 'PM' ? 12 : 0),
          parseInt(minutes),
          parseInt(seconds)
        );

        if (isNaN(date.getTime())) {
          console.error('Failed to create date from components:', {
            year, month: monthIndex, day, hours, minutes, seconds, ampm
          });
          throw new Error('Invalid date format');
        }

        // Third line and beyond is the quote
        const quote = lines.slice(2).join('\n').trim();
        

        
        console.log('Successfully parsed metadata:');
        console.log('- Book:', bookTitle);
        console.log('- Author:', bookAuthor);
        console.log('- Page:', page);
        console.log('- Location:', location);
        console.log('- Date:', fullDateStr);
        console.log('- Parsed date:', date.toISOString());
        console.log('- Quote length:', quote.length);

        return {
          id: `${bookTitle}-${location}-${date.getTime()}`, // Create unique ID
          Content: quote,
          BookTitle: bookTitle.trim(),
          BookAuthor: bookAuthor.trim(),
          Location: location,
          Page: page,
          CreatedKindle: date.toISOString(),
          CreatedWebsite: date.toISOString(),
          AnnotationType: 'Highlight'
        };
      } catch (error) {
        console.error(`Error processing highlight ${index + 1}:`, error);
        throw error;
      }
    });
  } catch (error) {
    console.error('Error parsing Kindle highlights:', error);
    throw new Error('Failed to parse Kindle highlights file. Please check the format.');
  }
};

/**
 * Imports quotes from a Kindle highlights text file
 * @param {string} text - The raw text from the Kindle highlights file
 * @returns {Promise<void>}
 */
export const importKindleHighlights = async (text) => {
  try {
    console.log('Starting import of Kindle highlights...');
    console.log('Input text length:', text.length);
    console.log('First 500 characters of input:', text.substring(0, 500));
    
    // Split into individual highlights
    const highlights = text.split('==========').filter(h => h.trim());
    console.log('Number of highlights found:', highlights.length);
    
    if (highlights.length === 0) {
      console.error('No highlights found in the text. Check if the separator "==========" is present.');
      throw new Error('No highlights found in the text. Please check the file format.');
    }

    // Log first highlight for debugging
    console.log('First highlight raw text:', highlights[0]);
    
    const quotes = parseKindleHighlights(text);
    console.log('Successfully parsed quotes. Total count:', quotes.length);

    // Print first few quotes with their metadata
    console.log('\nFirst 3 parsed quotes:');
    quotes.slice(0, 3).forEach((quote, index) => {
      console.log(`\nQuote ${index + 1}:`);
      console.log('Content:', quote.Content);
      console.log('BookTitle:', quote.BookTitle);
      console.log('BookAuthor:', quote.BookAuthor);
      console.log('Location:', quote.Location);
      console.log('CreatedKindle:', quote.CreatedKindle);
    });
    
    // Store the imported quotes
    await AsyncStorage.setItem(STORAGE_KEYS.IMPORTED_QUOTES, JSON.stringify(quotes));
    console.log('Successfully stored quotes in AsyncStorage');
    
    // Clear the daily quote selection to force a new one
    await AsyncStorage.removeItem(STORAGE_KEYS.QUOTE_DATE);
    await AsyncStorage.removeItem(STORAGE_KEYS.QUOTE_INDEX);
    console.log('Cleared daily quote selection');
    
    return quotes;
  } catch (error) {
    console.error('Error importing Kindle highlights:', error);
    console.error('Error stack trace:', error.stack);
    throw error;
  }
};

/**
 * Loads quotes from either imported data or the bundled JSON file
 * @returns {Array} Array of quote objects
 */
export const loadQuotes = async () => {
  try {
    // First try to load imported quotes
    const importedQuotes = await AsyncStorage.getItem(STORAGE_KEYS.IMPORTED_QUOTES);
    if (importedQuotes) {
      const parsedQuotes = JSON.parse(importedQuotes);
      if (!Array.isArray(parsedQuotes)) {
        throw new Error('Invalid imported quotes format');
      }
      return parsedQuotes;
    }
    
    // Fall back to bundled quotes
    const bundledQuotes = require('../assets/quotes.json'); // Make sure this path is correct
    if (!Array.isArray(bundledQuotes)) {
      throw new Error('Invalid bundled quotes format');
    }
    if (bundledQuotes.length === 0) {
      throw new Error('No quotes available in the database');
    }
    
    return bundledQuotes;
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
    const quotes = await loadQuotes();
    if (!quotes.length) {
      throw new Error('No quotes available');
    }

    // Get stored date and index
    const storedDate = await AsyncStorage.getItem(STORAGE_KEYS.QUOTE_DATE);
    const storedIndex = await AsyncStorage.getItem(STORAGE_KEYS.QUOTE_INDEX);
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
    await AsyncStorage.setItem(STORAGE_KEYS.QUOTE_DATE, today);
    await AsyncStorage.setItem(STORAGE_KEYS.QUOTE_INDEX, selectedIndex.toString());

    return selectedQuote;
  } catch (error) {
    console.error('Error in getDailyQuote:', error);
    throw new Error('Unable to get your daily quote. Please try again later.');
  }
}; 