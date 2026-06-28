import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getAccounts } from '../services/billing';
import { colors, light, dark as darkTheme } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, profile, logout } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;

  const [linkedAccounts, setLinkedAccounts] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const accts = await getAccounts(user.uid);
      setLinkedAccounts(accts.map((a, i) => ({ id: a.accountNumber || `acct-${i}`, ...a })));
    })();
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(profile?.first_name?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <Text style={[styles.name, { color: t.text }]}>{profile?.first_name} {profile?.last_name}</Text>
        <Text style={[styles.email, { color: t.textSecondary }]}>{profile?.email || user?.email}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: t.card }]}>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Linked Accounts</Text>
        {linkedAccounts.length > 0 ? linkedAccounts.map((a) => (
          <View key={a.id} style={styles.accountItem}>
            <Text style={[styles.accountNum, { color: t.text }]}>{a.id}</Text>
            <Text style={[styles.accountName, { color: t.textSecondary }]}>{a.accountName || ''}</Text>
            <Text style={[styles.accountStatus, { color: a.status === 'active' ? '#10B981' : '#F59E0B' }]}>
              {(a.status || '').charAt(0).toUpperCase() + (a.status || '').slice(1)}
            </Text>
          </View>
        )) : (
          <Text style={[styles.emptyText, { color: t.textSecondary }]}>No accounts linked</Text>
        )}
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('AddAccount')}>
          <Text style={styles.linkBtnText}>+ Add Account</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: t.card }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={[styles.menuText, { color: t.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 32 },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  name: { fontSize: 20, fontWeight: '700' },
  email: { fontSize: 14, marginTop: 4 },
  section: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  accountItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  accountNum: { fontSize: 14, fontWeight: '600' },
  accountName: { fontSize: 12, marginTop: 2 },
  accountStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 12 },
  linkBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFF3E6', borderRadius: 10 },
  linkBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  menuItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuText: { fontSize: 15, fontWeight: '500' },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});
