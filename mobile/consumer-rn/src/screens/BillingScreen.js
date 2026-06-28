import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getAccounts, getBills, getCurrentBill } from '../services/billing';
import BillCard from '../components/BillCard';
import { colors, light, dark as darkTheme } from '../theme';

export default function BillingScreen({ navigation }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const load = useCallback(async (acct) => {
    setLoading(true);
    try {
      const [bs, cb] = await Promise.all([
        getBills(acct?.id),
        getCurrentBill(acct?.id),
      ]);
      setBills(bs);
      setCurrentBill(cb);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const accts = await getAccounts(user.uid);
      const mapped = accts.map((a, i) => ({ id: a.accountNumber || `acct-${i}`, ...a }));
      setAccounts(mapped);
      if (mapped.length > 0) {
        setSelectedAccount(mapped[0]);
        load(mapped[0]);
      } else {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(selectedAccount)} />}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Billing</Text>
        {accounts.length > 0 && (
          <TouchableOpacity style={styles.selector} onPress={() => setShowPicker(!showPicker)}>
            <Text style={[styles.selectorText, { color: t.text }]}>{selectedAccount?.id}</Text>
            <Text style={{ color: t.textSecondary }}>▼</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <View style={[styles.pickerCard, { backgroundColor: t.card, borderColor: t.border }]}>
          {accounts.map((a) => (
            <TouchableOpacity key={a.id} style={styles.pickerItem} onPress={() => { setSelectedAccount(a); setShowPicker(false); load(a); }}>
              <Text style={[styles.pickerText, { color: selectedAccount?.id === a.id ? colors.primary : t.text }]}>{a.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {currentBill && (
        <TouchableOpacity style={styles.currentBillCard} onPress={() => navigation.navigate('BillDetail', { bill: currentBill })}>
          <Text style={styles.currentLabel}>Current Bill - {currentBill.billingPeriod}</Text>
          <Text style={styles.currentAmount}>₱{(currentBill.totalAmountDue || 0).toLocaleString()}</Text>
          {currentBill.dueDate && <Text style={styles.currentDue}>Due: {currentBill.dueDate}</Text>}
        </TouchableOpacity>
      )}

      <View style={[styles.section, { backgroundColor: t.card }]}>
        <Text style={[styles.sectionTitle, { color: t.text }]}>Bill History</Text>
        {bills.length > 0 ? bills.map((b, i) => (
          <TouchableOpacity key={i} onPress={() => navigation.navigate('BillDetail', { bill: b })}>
            <BillCard period={b.billingPeriod} kwh={b.kwh} amount={b.totalAmountDue} status={b.status} />
          </TouchableOpacity>
        )) : (
          !loading && <Text style={[styles.empty, { color: t.textSecondary }]}>No bills found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800' },
  selector: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  selectorText: { fontSize: 13, fontWeight: '600' },
  pickerCard: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, padding: 4 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  pickerText: { fontSize: 14, fontWeight: '600' },
  currentBillCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: colors.primary, borderRadius: 16, padding: 20 },
  currentLabel: { fontSize: 13, color: '#FFB380' },
  currentAmount: { fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 4 },
  currentDue: { fontSize: 12, color: '#FFB380', marginTop: 4 },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', paddingVertical: 24, fontSize: 14 },
});
