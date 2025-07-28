import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useColorScheme, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateNotificationTime } from '../utils/notificationUtils';
import { importKindleHighlights } from '../utils/quoteUtils';
import { COLORS, STORAGE_KEYS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
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

  const SettingSection = ({ title, children, icon }) => (
    <LinearGradient
      colors={colors.gradient.card}
      style={[styles.section, SHADOWS.md]}
    >
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {children}
    </LinearGradient>
  );

  const SettingItem = ({ label, description, children, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        {icon && <Ionicons name={icon} size={20} color={colors.accent} style={styles.settingIcon} />}
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      </View>
      {description && (
        <Text 
          style={[styles.settingDescription, { color: colors.textLight }]}
          numberOfLines={0}
        >
          {description}
        </Text>
      )}
      <View style={styles.settingControl}>
        {children}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={colors.gradient.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <Ionicons name="settings" size={32} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Customize your quote experience
          </Text>
        </View>

        <SettingSection title="Notifications" icon="notifications">
          <SettingItem 
            label="Daily Notification Time"
            description="Choose when you'd like to receive your daily quote"
            icon="time"
          >
            <TouchableOpacity 
              style={[styles.timeButton, { backgroundColor: colors.primary }]}
              onPress={showTimePickerModal}
            >
              <Ionicons name="time" size={16} color={colors.buttonText} />
              <Text style={[styles.timeButtonText, { color: colors.buttonText }]}>
                {notificationTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </TouchableOpacity>
          </SettingItem>

          {showTimePicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={notificationTime}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            </View>
          )}
        </SettingSection>

        <SettingSection title="Library Management" icon="library">
          <SettingItem 
            label="Import Kindle Highlights"
            description="Add your Kindle highlights to expand your quote collection. Select a text file with highlights separated by '=========='."
            icon="cloud-upload"
          >
            <TouchableOpacity 
              style={[
                styles.importButton, 
                { backgroundColor: importing ? colors.textLighter : colors.primary }
              ]}
              onPress={handleImport}
              disabled={importing}
            >
              {importing ? (
                <ActivityIndicator size="small" color={colors.buttonText} />
              ) : (
                <Ionicons name="document-text" size={16} color={colors.buttonText} />
              )}
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                {importing ? 'Importing...' : 'Select File'}
              </Text>
            </TouchableOpacity>
          </SettingItem>
        </SettingSection>

        <SettingSection title="Debug Information" icon="bug">
          <SettingItem 
            label="Check Scheduled Notifications"
            description="View upcoming notification schedule for troubleshooting"
            icon="information-circle"
          >
            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: colors.accent }]}
              onPress={checkNextNotification}
            >
              <Ionicons name="search" size={16} color={colors.buttonText} />
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                Check
              </Text>
            </TouchableOpacity>
          </SettingItem>
          
          {scheduledNotification && (
            <View style={[styles.debugOutput, { backgroundColor: colors.backgroundSecondary }]}>
              <ScrollView style={styles.debugScrollView} nestedScrollEnabled>
                <Text style={[styles.debugText, { color: colors.text }]}>
                  {scheduledNotification}
                </Text>
              </ScrollView>
            </View>
          )}
        </SettingSection>
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
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes['3xl'],
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
  section: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginLeft: SPACING.md,
  },
  settingItem: {
    marginBottom: SPACING['2xl'],
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  settingIcon: {
    marginRight: SPACING.sm,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    flex: 1,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
    color: 'inherit',
  },
  settingControl: {
    alignItems: 'flex-end',
    marginTop: SPACING.sm,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  timeButtonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  debugOutput: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    maxHeight: 200,
    ...SHADOWS.sm,
  },
  debugScrollView: {
    flex: 1,
  },
  debugText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: TYPOGRAPHY.lineHeights.snug,
  },
});

export default SettingsScreen; 