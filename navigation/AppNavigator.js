import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AllQuotesScreen from '../screens/AllQuotesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const COLORS = {
  primary: '#2DD4BF', // Turquoise
  primaryDark: '#0D9488', // Darker turquoise for hover/press states
  background: '#FFFFFF',
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Kindle Quotes' }}
      />
      <Stack.Screen 
        name="AllQuotes" 
        component={AllQuotesScreen}
        options={{ title: 'All Quotes' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 