import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { initializeNotifications } from './utils/notificationUtils';
import * as Notifications from 'expo-notifications';

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    console.log('Initializing notifications');
    initializeNotifications();

    // Set up notification response handler
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      console.log('Notification tapped:', data);
      
      // Navigate to the main screen with the quote data
      if (data && navigationRef.current) {
        navigationRef.current.navigate('Home', { 
          quoteId: data.quoteId,
          quote: data.quote
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}
