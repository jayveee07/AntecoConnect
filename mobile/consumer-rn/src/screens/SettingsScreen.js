import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { colors, light, dark as darkTheme } from '../theme';

export default function SettingsScreen() {
  const { isDark, toggle } = useTheme();
  const { logout } = useAuth();
  const t = isDark ? darkTheme : light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={[styles.section, { backgroundColor: t.card }]}>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: t.text }]}>Dark Mode</Text>
          <Switch value={isDark} onValueChange={() => toggle()} trackColor={{ false: '#D1D5DB', true: colors.primary }} thumbColor="#FFF" />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: t.card }]}>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Account</Text>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: t.border }]} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 15 },
  settingItem: { paddingVertical: 14, borderBottomWidth: 1 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});
