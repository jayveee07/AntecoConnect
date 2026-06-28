import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { doc, setDoc, getDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

export default function AddAccountScreen({ navigation }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ accountNumber: '', accountName: '', relationship: '', mobileNumber: '' });
  const [loading, setLoading] = useState(false);

  const update = (key) => (val) => setForm((p) => ({ ...p, [key]: typeof val === 'string' ? val : val.nativeEvent.text }));

  const handleSubmit = async () => {
    if (!form.accountNumber.trim() || !form.accountName.trim() || !form.relationship || !form.mobileNumber.trim()) {
      Alert.alert('Error', 'All fields are required'); return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const can = form.accountNumber.trim().toUpperCase();
      const linkRef = doc(db, 'linkAccounts', user.uid);
      const linkSnap = await getDoc(linkRef);
      const existing = linkSnap.exists() ? linkSnap.data().accounts || [] : [];
      if (existing.some((a) => a.accountNumber === can)) {
        Alert.alert('Error', 'Account already linked'); setLoading(false); return;
      }

      const consumerSnap = await getDocs(query(collection(db, 'consumers'), where('can', '==', can)));
      if (consumerSnap.empty) {
        Alert.alert('Error', 'Account not found in ANTECO records'); setLoading(false); return;
      }

      const consumer = consumerSnap.docs[0].data();
      if (consumer.ownerName?.toLowerCase() !== form.accountName.trim().toLowerCase()) {
        Alert.alert('Error', 'Name does not match our records'); setLoading(false); return;
      }

      await setDoc(linkRef, {
        accounts: arrayUnion({
          accountNumber: can,
          accountName: consumer.ownerName,
          relationship: form.relationship,
          mobileNumber: form.mobileNumber.trim(),
          status: 'active',
          consumerId: consumerSnap.docs[0].id,
          linkedAt: new Date().toISOString(),
        }),
      }, { merge: true });

      Alert.alert('Success', 'Account linked!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to link account');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={{ fontSize: 48, textAlign: 'center' }}>⚡</Text>
        <Text style={styles.title}>Link Your Account</Text>
        <Text style={styles.subtitle}>Connect your ANTECO electric service account.</Text>

        <Text style={styles.label}>Account Number</Text>
        <TextInput style={styles.input} placeholder="e.g. ANT-2025-0001" placeholderTextColor="#9CA3AF" value={form.accountNumber} onChangeText={update('accountNumber')} autoCapitalize="characters" />

        <Text style={styles.label}>Name of Account Owner</Text>
        <TextInput style={styles.input} placeholder="Exact name as shown on bill" placeholderTextColor="#9CA3AF" value={form.accountName} onChangeText={update('accountName')} />

        <Text style={styles.label}>Relationship</Text>
        {['owner', 'family', 'tenant', 'representative'].map((rel) => (
          <TouchableOpacity key={rel} style={[styles.radio, form.relationship === rel && styles.radioActive]} onPress={() => setForm((p) => ({ ...p, relationship: rel }))}>
            <View style={[styles.radioCircle, form.relationship === rel && styles.radioCircleActive]}>
              {form.relationship === rel && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.radioLabel, form.relationship === rel && { color: colors.primary }]}>
              {rel.charAt(0).toUpperCase() + rel.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput style={styles.input} placeholder="0917xxxxxxx" placeholderTextColor="#9CA3AF" value={form.mobileNumber} onChangeText={update('mobileNumber')} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify & Link Account</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827' },
  radio: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  radioActive: { borderColor: colors.primary, backgroundColor: '#FFF3E6' },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  radioCircleActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  radioLabel: { fontSize: 14, color: '#374151' },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
