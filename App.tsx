import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { initializeNotifications } from './utils/notificationUtils';

export default function App() {
  useEffect(() => {
    console.log('Initializing notifications');
    initializeNotifications();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
