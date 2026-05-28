import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { LightTheme, DarkTheme } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';

const Stack = createStackNavigator();

function AuthStack({ colors }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
    </Stack.Navigator>
  );
}

function MainStack({ colors }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Projects"
        component={ProjectListScreen}
        options={{ title: 'TaskFlow' }}
      />
      <Stack.Screen
        name="CreateProject"
        component={CreateProjectScreen}
        options={{ title: 'New Project' }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{ title: 'Project' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { token, sessionChecked } = useSelector((s) => s.auth);
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  // Don't render until we've checked for existing session
  if (!sessionChecked) {
    return null;
  }

  return (
    <NavigationContainer>
      {token ? <MainStack colors={colors} /> : <AuthStack colors={colors} />}
    </NavigationContainer>
  );
}
