/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  QUOTE_DATE: 'quoteOfTheDayDate',
  QUOTE_INDEX: 'quoteOfTheDayIndex',
  NOTIFICATION_TIME: 'notificationTime',
  IMPORTED_QUOTES: 'importedQuotes',
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
 * Modern color scheme for light and dark modes with gradients and enhanced palette
 */
export const COLORS = {
  light: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#8B5CF6',
    accent: '#F59E0B',
    accentLight: '#FCD34D',
    text: '#1F2937',
    textLight: '#6B7280',
    textLighter: '#9CA3AF',
    background: '#FAFAFA',
    backgroundSecondary: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardBorder: '#F1F5F9',
    buttonText: '#FFFFFF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    separator: '#E2E8F0',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      accent: ['#F59E0B', '#F97316'],
      background: ['#FAFAFA', '#F1F5F9'],
      card: ['#FFFFFF', '#F8FAFC'],
    },
  },
  dark: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#8B5CF6',
    accent: '#F59E0B',
    accentLight: '#FCD34D',
    text: '#F8FAFC',
    textLight: '#CBD5E1',
    textLighter: '#94A3B8',
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    cardBackground: '#1E293B',
    cardBorder: '#334155',
    buttonText: '#FFFFFF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    separator: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradient: {
      primary: ['#6366F1', '#8B5CF6'],
      accent: ['#F59E0B', '#F97316'],
      background: ['#0F172A', '#1E293B'],
      card: ['#1E293B', '#334155'],
    },
  },
};

/**
 * Typography scale
 */
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

/**
 * Spacing scale
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

/**
 * Border radius scale
 */
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

/**
 * Shadow presets
 */
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
}; 