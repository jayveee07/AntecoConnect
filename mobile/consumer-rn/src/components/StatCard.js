import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <View style={[styles.card, { backgroundColor: bgColor || '#F3F4F6' }]}>
      <View style={[styles.iconWrap, { backgroundColor: color || '#FF6B00' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: color || '#FF6B00' }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, alignItems: 'center', flex: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 20, color: '#FFF' },
  value: { fontSize: 22, fontWeight: '700' },
  label: { fontSize: 12, color: '#6B7280', marginTop: 2, textAlign: 'center' },
});
