import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { colors, light, dark as darkTheme } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import BillingScreen from '../screens/BillingScreen';
import BillDetailScreen from '../screens/BillDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user, profile, logout } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: t.background }}>
      <View style={[styles.drawerHeader, { borderBottomColor: t.border }]}>
        <View style={styles.drawerAvatar}>
          <Text style={styles.drawerAvatarText}>{(profile?.first_name?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <Text style={[styles.drawerName, { color: t.text }]}>{profile?.first_name} {profile?.last_name}</Text>
        <Text style={[styles.drawerEmail, { color: t.textSecondary }]}>{profile?.email || user?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={[styles.drawerFooter, { borderTopColor: t.border }]}>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: t.background },
        drawerLabelStyle: { fontSize: 14, fontWeight: '500', color: t.text },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: t.textSecondary,
        headerStyle: { backgroundColor: isDark ? '#1F2937' : '#FF6B00' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard', drawerIcon: () => <Text>🏠</Text> }} />
      <Drawer.Screen name="Billing" component={BillingScreen} options={{ title: 'Bills & Payments', drawerIcon: () => <Text>📄</Text> }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', drawerIcon: () => <Text>👤</Text> }} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications', drawerIcon: () => <Text>🔔</Text> }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings', drawerIcon: () => <Text>⚙️</Text> }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="BillDetail" component={BillDetailScreen} options={{ headerShown: true, title: 'Bill Details', headerStyle: { backgroundColor: '#FF6B00' }, headerTintColor: '#FFF', headerTitleStyle: { fontWeight: '700' } }} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ headerShown: true, title: 'Link Account', headerStyle: { backgroundColor: '#FF6B00' }, headerTintColor: '#FFF' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { padding: 20, borderBottomWidth: 1, marginBottom: 8 },
  drawerAvatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  drawerAvatarText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  drawerName: { fontSize: 16, fontWeight: '700' },
  drawerEmail: { fontSize: 12, marginTop: 2 },
  drawerFooter: { borderTopWidth: 1, padding: 16, marginTop: 16 },
  logoutBtn: { paddingVertical: 12 },
  logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
});
