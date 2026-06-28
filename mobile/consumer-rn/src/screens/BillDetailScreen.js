import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function BillDetailScreen({ route }) {
  const bill = route?.params?.bill || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.period}>{bill.billingPeriod || 'N/A'}</Text>
        <Text style={styles.amount}>₱{(bill.totalAmountDue || 0).toLocaleString()}</Text>
        {bill.dueDate && <Text style={styles.due}>Due: {bill.dueDate}</Text>}
        <Text style={[styles.status, { color: bill.status === 'paid' ? '#10B981' : '#F59E0B' }]}>
          {(bill.status || 'Unknown').charAt(0).toUpperCase() + (bill.status || '').slice(1)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meter Readings</Text>
        <View style={styles.row}><Text style={styles.label}>Present Reading</Text><Text style={styles.value}>{bill.presentReading || 'N/A'} kWh</Text></View>
        <View style={styles.row}><Text style={styles.label}>Previous Reading</Text><Text style={styles.value}>{bill.previousReading || 'N/A'} kWh</Text></View>
        <View style={styles.row}><Text style={styles.label}>Consumption</Text><Text style={styles.value}>{bill.kwh || 0} kWh</Text></View>
        <View style={styles.row}><Text style={styles.label}>Reading Days</Text><Text style={styles.value}>{bill.readingDays || 0} days</Text></View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Charge Breakdown</Text>
        {bill.generationCharge != null && <Row label="Generation Charge" value={bill.generationCharge} />}
        {bill.transmissionCharge != null && <Row label="Transmission Charge" value={bill.transmissionCharge} />}
        {bill.distributionCharge != null && <Row label="Distribution Charge" value={bill.distributionCharge} />}
        {bill.subsidiesCharge != null && <Row label="Subsidies" value={bill.subsidiesCharge} />}
        {bill.governmentTaxes != null && <Row label="Government Taxes" value={bill.governmentTaxes} />}
        {bill.otherCharges != null && <Row label="Other Charges" value={bill.otherCharges} />}
        <View style={[styles.row, styles.totalRow]}><Text style={styles.totalLabel}>Total Due</Text><Text style={styles.totalValue}>₱{(bill.totalAmountDue || 0).toLocaleString()}</Text></View>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>₱{(value || 0).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FF6B00', padding: 24, alignItems: 'center' },
  period: { fontSize: 16, color: '#FFB380' },
  amount: { fontSize: 36, fontWeight: '800', color: '#FFF', marginTop: 4 },
  due: { fontSize: 14, color: '#FFB380', marginTop: 4 },
  status: { fontSize: 14, fontWeight: '700', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, overflow: 'hidden' },
  card: { backgroundColor: '#FFF', borderRadius: 16, margin: 16, marginTop: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { fontSize: 14, color: '#6B7280' },
  value: { fontSize: 14, fontWeight: '600', color: '#111827' },
  totalRow: { borderBottomWidth: 0, marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 15, fontWeight: '800', color: '#FF6B00' },
});
