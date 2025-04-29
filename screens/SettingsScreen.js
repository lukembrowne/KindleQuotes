import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useColorScheme, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateNotificationTime } from '../utils/notificationUtils';
import { importKindleHighlights } from '../utils/quoteUtils';
import { COLORS, STORAGE_KEYS } from '../utils/constants';
import * as Notifications from 'expo-notifications';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const SettingsScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduledNotification, setScheduledNotification] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadNotificationTime();
  }, []);

  const loadNotificationTime = async () => {
    try {
      const savedTime = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME);
      if (savedTime) {
        setNotificationTime(new Date(savedTime));
      } else {
        // Set default time to 2:00 PM
        const defaultTime = new Date();
        defaultTime.setHours(14, 0, 0, 0);
        setNotificationTime(defaultTime);
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, defaultTime.toISOString());
      }
    } catch (error) {
      console.error('Error loading notification time:', error);
      Alert.alert('Error', 'Failed to load notification time settings');
    }
  };

  const handleTimeChange = async (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setNotificationTime(selectedTime);
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, selectedTime.toISOString());
        await updateNotificationTime(selectedTime);
        Alert.alert('Success', 'Notification time updated successfully');
      } catch (error) {
        console.error('Error saving notification time:', error);
        Alert.alert('Error', 'Failed to update notification time');
      }
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const checkNextNotification = async () => {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledNotification(JSON.stringify(notifications, null, 2));
    } catch (error) {
      console.error('Error checking notifications:', error);
      setScheduledNotification('Error fetching notification data');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setImporting(true);
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const quotes = await importKindleHighlights(fileContent);
      
      Alert.alert(
        'Success',
        `Successfully imported ${quotes.length} quotes. The app will now use these quotes for notifications.`
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notification Settings</Text>
        
        <View style={styles.timeContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Daily Notification Time</Text>
          <TouchableOpacity 
            style={[styles.timeButton, { backgroundColor: colors.primary }]}
            onPress={showTimePickerModal}
          >
            <Text style={[styles.timeButtonText, { color: colors.buttonText }]}>
              {notificationTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={notificationTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.importSection}>
          <Text style={[styles.label, { color: colors.text }]}>Import Kindle Highlights</Text>
          <Text style={[styles.helpText, { color: colors.textLight }]}>
            Select a text file containing your Kindle highlights. Each highlight should be separated by "=========="
          </Text>
          <TouchableOpacity 
            style={[styles.importButton, { backgroundColor: colors.primary }]}
            onPress={handleImport}
            disabled={importing}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {importing ? 'Importing...' : 'Select Highlights File'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.debugSection}>
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: colors.primary }]}
            onPress={checkNextNotification}
          >
            <Text style={[styles.timeButtonText, { color: colors.buttonText }]}>
              Check Next Notification
            </Text>
          </TouchableOpacity>
          
          {scheduledNotification ? (
            <View style={styles.notificationInfo}>
              <ScrollView style={styles.scrollView}>
                <Text style={[styles.notificationText, { color: colors.text }]}>
                  {scheduledNotification}
                </Text>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  timeButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  importSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 10,
  },
  importButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugSection: {
    marginTop: 20,
    padding: 10,
    flex: 1,
  },
  debugButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationInfo: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flex: 1,
    minHeight: 200,
  },
  scrollView: {
    flex: 1,
  },
  notificationText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 5,
  },
});

export default SettingsScreen; 