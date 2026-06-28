import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BillCard({ period, kwh, amount, status }) {
  const statusColor = status === 'paid' || status === 'settled' ? '#10B981' : status === 'unpaid' || status === 'pending' ? '#F59E0B' : '#6B7280';
  const statusLabel = status === 'pending_verification' ? 'Pending' : status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <View>
          <Text style={styles.period}>{period}</Text>
          <Text style={styles.kwh}>{kwh || 0} kWh consumed</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>₱{(amount || 0).toLocaleString()}</Text>
        <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 8 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 18, color: '#FFF', fontWeight: '700' },
  period: { fontSize: 14, fontWeight: '600', color: '#111827' },
  kwh: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 14, fontWeight: '700', color: '#111827' },
  status: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});
