import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

export default function PaymentsScreen({ route }) {
  const { user } = useAuth();
  const bill = route?.params?.bill;
  const [amount, setAmount] = useState(String(bill?.totalAmountDue || ''));
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount'); return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        consumerAccountId: bill?.consumerAccountId || '',
        amount: Number(amount),
        billingPeriod: bill?.billingPeriod || '',
        paymentMethod: 'credit_card',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Payment initiated!');
    } catch (e) {
      Alert.alert('Error', e.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Make a Payment</Text>
        {bill && <Text style={styles.billRef}>Bill: {bill.billingPeriod} - ₱{(bill.totalAmountDue || 0).toLocaleString()}</Text>}

        <Text style={styles.label}>Amount (₱)</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor="#9CA3AF" />

        <TouchableOpacity style={styles.button} onPress={handlePay} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Pay Now</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  billRef: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
