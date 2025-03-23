import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyQuote } from './quoteUtils';
import { Alert } from 'react-native';
import { 
  STORAGE_KEYS, 
  MAX_NOTIFICATION_LENGTH,
  DEFAULT_NOTIFICATION_HOUR,
  DEFAULT_NOTIFICATION_MINUTE,
  COLORS 
} from './constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Shows a toast notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success' or 'error')
 */
const showToast = (message, type = 'error') => {
  Alert.alert(
    type === 'success' ? 'Success' : 'Error',
    message,
    [{ text: 'OK' }],
    { cancelable: false }
  );
};

/**
 * Truncates a quote to fit in a notification
 * @param {string} quote - The quote text to truncate
 * @returns {string} Truncated quote with ellipsis if needed
 */
const truncateQuote = (quote) => {
  if (quote.length <= MAX_NOTIFICATION_LENGTH) return quote;
  return quote.substring(0, MAX_NOTIFICATION_LENGTH - 3) + '...';
};

/**
 * Schedules a daily notification with the current quote
 * @param {Date} notificationTime - The time to show the notification
 * @param {Object} quote - The quote object to display
 * @returns {Promise<void>}
 */
export const scheduleDailyNotification = async (notificationTime, quote) => {
  try {
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Create the notification content
    const content = {
      title: 'Your Daily Kindle Quote',
      body: truncateQuote(quote.Content),
      data: { quoteId: quote.id }, // Store quote ID for reference
    };

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        repeats: true, // Enable daily repetition
      },
    });

    console.log('Daily notification scheduled successfully');
  } catch (error) {
    console.warn('Error scheduling notification:', error);
    showToast('Failed to schedule daily notification. Please check your notification settings.');
    throw error;
  }
};

/**
 * Requests notification permissions from the user
 * @returns {Promise<boolean>} Whether permissions were granted
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    if (!granted) {
      showToast('Please enable notifications to receive your daily quotes.');
    }
    return granted;
  } catch (error) {
    console.warn('Error requesting notification permissions:', error);
    showToast('Failed to request notification permissions. Please check your device settings.');
    return false;
  }
};

/**
 * Initializes notifications for the app
 * This should be called when the app starts
 */
export const initializeNotifications = async () => {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return;
    }

    // Get the current daily quote
    const quote = await getDailyQuote();

    // Get notification time from storage or use default
    const savedTime = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME);
    const notificationTime = savedTime 
      ? new Date(savedTime)
      : (() => {
          const defaultTime = new Date();
          defaultTime.setHours(DEFAULT_NOTIFICATION_HOUR, DEFAULT_NOTIFICATION_MINUTE, 0, 0);
          return defaultTime;
        })();

    // Schedule the notification
    await scheduleDailyNotification(notificationTime, quote);
  } catch (error) {
    console.warn('Error initializing notifications:', error);
    showToast('Failed to initialize notifications. Some features may not work as expected.');
  }
};

/**
 * Updates the notification schedule when the time is changed
 * @param {Date} newTime - The new notification time
 */
export const updateNotificationTime = async (newTime) => {
  try {
    const quote = await getDailyQuote();
    await scheduleDailyNotification(newTime, quote);
    showToast('Notification time updated successfully', 'success');
  } catch (error) {
    console.warn('Error updating notification time:', error);
    showToast('Failed to update notification time. Please try again.');
    throw error;
  }
}; 