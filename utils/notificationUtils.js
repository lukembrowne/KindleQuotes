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
import { loadQuotes } from './quoteUtils';

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
// export const scheduleDailyNotification = async (notificationTime, quote) => {
//   try {
//     // Cancel any existing notifications
//     await Notifications.cancelAllScheduledNotificationsAsync();

//     // Create the notification content
//     const content = {
//       title: 'Your Daily Quote',
//       body: truncateQuote(quote.Content),
//       data: { quoteId: quote.id },
//     };

//     // Get the local timezone
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
//     console.log('Scheduling notification at:', notificationTime);
//     console.log('Using timezone:', timeZone);
    
//     await Notifications.scheduleNotificationAsync({
//       content,
//       trigger: {
//         type: Notifications.SchedulableTriggerInputTypes.DAILY,
//         hour: notificationTime.getHours(),
//         minute: notificationTime.getMinutes(),
//         repeats: true,
//         timeZone: timeZone, // Explicitly set the timezone
//       },
//     });

//     console.log('Daily notification scheduled successfully');
//     console.log("Next scheduled notification:", await Notifications.getAllScheduledNotificationsAsync());

//     // Testing
//     Notifications.scheduleNotificationAsync({
//       content,
//       trigger: {
//         type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//         seconds: 60 * 10, // every 10 minutes
//         repeats: true,
//       },
//     });

//     console.log("Next scheduled notification:", await Notifications.getAllScheduledNotificationsAsync());


//   } catch (error) {
//     console.warn('Error scheduling notification:', error);
//     showToast('Failed to schedule daily notification. Please check your notification settings.');
//     throw error;
//   }
// };

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
 * Add this new function to get multiple unique quotes
 * @param {number} count - The number of quotes to get
 * @returns {Promise<Array<Object>>} An array of quote objects
 */
const getMultipleUniqueQuotes = async (count) => {
  try {
    // Load all available quotes
    const allQuotes = loadQuotes();
    
    if (allQuotes.length < count) {
      throw new Error(`Not enough unique quotes available. Need ${count}, but only have ${allQuotes.length}`);
    }

    // Create a copy of the quotes array to avoid modifying the original
    const availableQuotes = [...allQuotes];
    const selectedQuotes = [];

    // Select random unique quotes
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      selectedQuotes.push(availableQuotes[randomIndex]);
      // Remove the selected quote to avoid duplicates
      availableQuotes.splice(randomIndex, 1);
    }

    return selectedQuotes;
  } catch (error) {
    console.warn('Error getting multiple quotes:', error);
    throw error;
  }
};

/**
 * Schedules multiple notifications starting from a given time
 * @param {Date} startTime - The start time for the notifications
 * @param {number} intervalSeconds - The interval between notifications in seconds
 * @param {number} count - The number of notifications to schedule
 * @returns {Promise<void>}
 */
export const scheduleMultipleNotifications = async (startTime, intervalSeconds = 5, count = 25) => {
  try {
    console.log('Starting to schedule multiple notifications...');
    console.log(`Start time: ${startTime.toISOString()}`);
    console.log(`Interval: ${intervalSeconds} seconds`);
    console.log(`Number of notifications: ${count}`);

    // Cancel any existing notifications
    console.log('Cancelling existing notifications...');
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Existing notifications cancelled');

    // Get multiple unique quotes
    console.log('Fetching unique quotes...');
    const quotes = await getMultipleUniqueQuotes(count);
    console.log(`Successfully fetched ${quotes.length} unique quotes`);
    
    // Get the local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`Using timezone: ${timeZone}`);
    
    // Schedule multiple notifications
    console.log('Starting to schedule notifications...');
    for (let i = 0; i < count; i++) {
      const notificationTime = new Date(startTime.getTime() + (i * intervalSeconds * 1000));
      console.log(`\nScheduling notification #${i + 1}:`);
      console.log(`- Time: ${notificationTime.toISOString()}`);
      console.log(`- Quote: "${quotes[i].Content.substring(0, 50)}..."`);
      
      const content = {
        title: `Quote #${i + 1}`,
        body: truncateQuote(quotes[i].Content),
        data: { quoteId: quotes[i].id },
      };

      await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationTime,
          timeZone: timeZone,
        },
      });
      console.log(`✓ Notification #${i + 1} scheduled successfully`);
    }

    console.log('\nAll notifications scheduled successfully');
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Total scheduled notifications: ${scheduledNotifications.length}`);
    console.log('First notification:', scheduledNotifications[0]);
    console.log('Last notification:', scheduledNotifications[scheduledNotifications.length - 1]);

  } catch (error) {
    console.warn('Error scheduling multiple notifications:', error);
    showToast('Failed to schedule notifications. Please check your settings.');
    throw error;
  }
};

/**
 * Initializes notifications for the app
 * This should be called when the app starts
 */
export const initializeNotifications = async () => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return;
    }

    // Schedule notifications starting 1 minute from now
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 1);
    console.log('Scheduling notifications to start at:', startTime.toISOString());
    
    await scheduleMultipleNotifications(startTime);
    
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
    await scheduleMultipleNotifications(newTime);
    showToast('Notifications updated successfully', 'success');
  } catch (error) {
    console.warn('Error updating notification time:', error);
    showToast('Failed to update notifications. Please try again.');
    throw error;
  }
}; 