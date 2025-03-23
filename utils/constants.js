/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  QUOTE_DATE: 'quoteOfTheDayDate',
  QUOTE_INDEX: 'quoteOfTheDayIndex',
  NOTIFICATION_TIME: 'notificationTime',
};

/**
 * Maximum number of retries for quote selection
 */
export const MAX_RETRIES = 3;

/**
 * Maximum length for notification quote text
 */
export const MAX_NOTIFICATION_LENGTH = 100;

/**
 * Default notification time (2:00 PM)
 */
export const DEFAULT_NOTIFICATION_HOUR = 14;
export const DEFAULT_NOTIFICATION_MINUTE = 0;

/**
 * Color scheme for light and dark modes
 */
export const COLORS = {
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
    separator: '#E5E7EB',
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
    separator: '#4B5563',
  },
}; 