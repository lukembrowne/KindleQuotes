import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AllQuotesScreen from '../screens/AllQuotesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const COLORS = {
  light: {
    primary: '#2DD4BF', // Turquoise
    primaryDark: '#0D9488', // Darker turquoise for hover/press states
    background: '#FFFFFF',
    headerText: '#FFFFFF',
  },
  dark: {
    primary: '#2DD4BF',
    primaryDark: '#0D9488',
    background: '#1F2937',
    headerText: '#FFFFFF',
  },
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
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