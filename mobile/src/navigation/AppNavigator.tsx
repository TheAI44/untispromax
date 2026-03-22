import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import TimetableScreen from '../screens/timetable/TimetableScreen';
import HomeworkScreen from '../screens/homework/HomeworkScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import RecoveryScreen from '../screens/recovery/RecoveryScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  accent: '#00b4ff',
  accent2: '#0066cc',
  bgPrimary: '#040d1a',
  bgCard: '#0a1f3d',
  textPrimary: '#e8f4ff',
  danger: '#ff4060',
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.bgPrimary,
        },
        headerTintColor: theme.accent,
        headerTitleStyle: {
          fontWeight: '700',
          color: theme.textPrimary,
        },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
    </Stack.Navigator>
  );
}

function TimetableStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgPrimary },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontWeight: '700', color: theme.textPrimary },
      }}
    >
      <Stack.Screen
        name="TimetableMain"
        component={TimetableScreen}
        options={{ title: 'Stundenplan' }}
      />
    </Stack.Navigator>
  );
}

function HomeworkStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgPrimary },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontWeight: '700', color: theme.textPrimary },
      }}
    >
      <Stack.Screen
        name="HomeworkMain"
        component={HomeworkScreen}
        options={{ title: 'Aufgaben' }}
      />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgPrimary },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontWeight: '700', color: theme.textPrimary },
      }}
    >
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{ title: 'Kalender' }}
      />
    </Stack.Navigator>
  );
}

function RecoveryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgPrimary },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontWeight: '700', color: theme.textPrimary },
      }}
    >
      <Stack.Screen
        name="RecoveryMain"
        component={RecoveryScreen}
        options={{ title: 'Krank' }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bgPrimary },
        headerTintColor: theme.accent,
        headerTitleStyle: { fontWeight: '700', color: theme.textPrimary },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: 'Einstellungen' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: '#3a6a9a',
        tabBarStyle: {
          backgroundColor: theme.bgCard,
          borderTopColor: 'rgba(0,180,255,0.13)',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabel: undefined,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'TimetableTab') iconName = 'calendar';
          else if (route.name === 'HomeworkTab') iconName = 'checkbox';
          else if (route.name === 'CalendarTab') iconName = 'today';
          else if (route.name === 'RecoveryTab') iconName = 'warning';
          else if (route.name === 'SettingsTab') iconName = 'settings';

          return (
            <Ionicons
              name={iconName}
              size={size || 28}
              color={color}
              style={{ marginBottom: -3 }}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="TimetableTab"
        component={TimetableStack}
        options={{ title: 'Stundenplan' }}
      />
      <Tab.Screen
        name="HomeworkTab"
        component={HomeworkStack}
        options={{ title: 'Aufgaben' }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStack}
        options={{ title: 'Kalender' }}
      />
      <Tab.Screen
        name="RecoveryTab"
        component={RecoveryStack}
        options={{ title: 'Krank' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{ title: 'Einstellungen' }}
      />
    </Tab.Navigator>
  );
}
