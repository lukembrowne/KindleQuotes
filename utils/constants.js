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
    primary: '#1E40AF',
    primaryDark: '#1E3A8A',
    text: '#1F2937',
    textLight: '#4B5563',
    textLighter: '#6B7280',
    background: '#F3F4F6',
    cardBackground: '#FFFFFF',
    buttonText: '#FFFFFF',
    error: '#DC2626',
    separator: '#E5E7EB',
  },
  dark: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    text: '#F3F4F6',
    textLight: '#D1D5DB',
    textLighter: '#9CA3AF',
    background: '#111827',
    cardBackground: '#1F2937',
    buttonText: '#FFFFFF',
    error: '#EF4444',
    separator: '#374151',
  },
}; 