import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { View, ActivityIndicator } from 'react-native';
import { colors } from './src/theme';

function RootNavigator() {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#111827' : '#FFF' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <AppNavigator /> : <LoginScreen />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
