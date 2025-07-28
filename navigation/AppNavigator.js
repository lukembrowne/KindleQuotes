import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AllQuotesScreen from '../screens/AllQuotesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'sunny' : 'sunny-outline';
          } else if (route.name === 'AllQuotes') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={focused ? size + 2 : size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLighter,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: SPACING.sm,
          paddingBottom: Platform.OS === 'ios' ? SPACING['2xl'] : SPACING.md,
          paddingHorizontal: SPACING.md,
          borderTopLeftRadius: BORDER_RADIUS.xl,
          borderTopRightRadius: BORDER_RADIUS.xl,
          position: 'absolute',
          ...SHADOWS.lg,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.sizes.xs,
          fontWeight: TYPOGRAPHY.weights.semibold,
          marginTop: SPACING.xs,
        },
        tabBarItemStyle: {
          paddingVertical: SPACING.xs,
        },
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: TYPOGRAPHY.sizes.xl,
          fontWeight: TYPOGRAPHY.weights.bold,
          color: colors.text,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Today',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="AllQuotes" 
        component={AllQuotesScreen}
        options={{ 
          title: 'Library',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator; 