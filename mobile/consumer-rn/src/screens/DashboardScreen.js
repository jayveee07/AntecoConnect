import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getAccounts, getCurrentBill, getBills } from '../services/billing';
import BillCard from '../components/BillCard';
import StatCard from '../components/StatCard';
import { colors, light, dark as darkTheme } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { user, profile } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const load = useCallback(async (acct) => {
    setLoading(true);
    try {
      const cb = await getCurrentBill(acct?.id);
      const bs = await getBills(acct?.id);
      setCurrentBill(cb);
      setRecentBills(bs.slice(0, 3));
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

  if (loading && !currentBill) {
    return <View style={[styles.center, { backgroundColor: t.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (accounts.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.background }]}>
        <Text style={{ fontSize: 48 }}>⚡</Text>
        <Text style={[styles.welcomeTitle, { color: t.text }]}>Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}!</Text>
        <Text style={[styles.welcomeSub, { color: t.textSecondary }]}>Link your ANTECO account to get started.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('AddAccount')}>
          <Text style={styles.primaryBtnText}>Link Your Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(selectedAccount)} />}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: t.textSecondary }]}>Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}</Text>
          <Text style={[styles.pageTitle, { color: t.text }]}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.selector} onPress={() => setShowPicker(!showPicker)}>
          <Text style={[styles.selectorText, { color: t.text }]}>{selectedAccount?.id || 'Select Account'}</Text>
          <Text style={{ color: t.textSecondary }}>▼</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <View style={[styles.pickerCard, { backgroundColor: t.card, borderColor: t.border }]}>
          {accounts.map((a) => (
            <TouchableOpacity key={a.id} style={styles.pickerItem} onPress={() => { setSelectedAccount(a); setShowPicker(false); load(a); }}>
              <Text style={[styles.pickerText, { color: selectedAccount?.id === a.id ? colors.primary : t.text }]}>{a.id}</Text>
              {a.accountName && <Text style={[styles.pickerSub, { color: t.textSecondary }]}>{a.accountName}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {currentBill && (
        <View style={styles.billCard}>
          <View style={styles.billHeader}>
            <View>
              <Text style={styles.billLabel}>Current Bill - {currentBill.billingPeriod}</Text>
              <Text style={styles.billAmount}>₱{(currentBill.totalAmountDue || 0).toLocaleString()}</Text>
              {currentBill.dueDate && <Text style={styles.billDue}>Due: {currentBill.dueDate}</Text>}
            </View>
          </View>
          <View style={styles.billActions}>
            <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('Payments', { bill: currentBill })}>
              <Text style={styles.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('BillDetail', { bill: currentBill })}>
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        {[
          { icon: '💰', label: 'Pay Bill', color: '#10B981', onPress: () => navigation.navigate('Payments') },
          { icon: '⚠️', label: 'Report Outage', color: '#EF4444', onPress: () => navigation.navigate('ReportOutage') },
          { icon: '📄', label: 'View Bills', color: '#3B82F6', onPress: () => navigation.navigate('Billing') },
          { icon: '📞', label: 'Contact Support', color: '#8B5CF6', onPress: () => navigation.navigate('Support') },
        ].map((action, i) => (
          <TouchableOpacity key={i} style={styles.actionBtn} onPress={action.onPress}>
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Text style={{ fontSize: 20 }}>{action.icon}</Text>
            </View>
            <Text style={[styles.actionLabel, { color: t.text }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsRow}>
        <StatCard icon="⚡" label="Usage" value={currentBill ? `${currentBill.kwh || 0} kWh` : '0 kWh'} color={colors.primary} />
        <StatCard icon="📈" label="Rate" value={currentBill ? `₱${(currentBill.ratePerKwh || 0).toFixed(2)}/kWh` : '₱0.00/kWh'} color="#10B981" />
        <StatCard icon="⏱️" label="Outages" value="0" color="#F59E0B" />
      </View>

      <View style={[styles.section, { backgroundColor: t.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Recent Bills</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Billing')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentBills.length > 0 ? recentBills.map((b, i) => (
          <BillCard key={i} period={b.billingPeriod} kwh={b.kwh} amount={b.totalAmountDue} status={b.status} />
        )) : (
          <View style={styles.emptyBills}>
            <Text style={{ fontSize: 32, textAlign: 'center' }}>📄</Text>
            <Text style={[styles.emptyText, { color: t.textSecondary }]}>No bills yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  greeting: { fontSize: 13, marginBottom: 2 },
  pageTitle: { fontSize: 24, fontWeight: '800' },
  selector: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F3F4F6' },
  selectorText: { fontSize: 13, fontWeight: '600' },
  pickerCard: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, padding: 4 },
  pickerItem: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  pickerText: { fontSize: 14, fontWeight: '600' },
  pickerSub: { fontSize: 11, marginTop: 2 },
  billCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: colors.primary, borderRadius: 16, padding: 20 },
  billHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  billLabel: { fontSize: 13, color: '#FFB380' },
  billAmount: { fontSize: 32, fontWeight: '800', color: '#FFF', marginTop: 4 },
  billDue: { fontSize: 12, color: '#FFB380', marginTop: 4 },
  billActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  payBtn: { flex: 1, backgroundColor: '#FFD600', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  payBtnText: { fontWeight: '700', color: '#000', fontSize: 14 },
  viewBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  viewBtnText: { fontWeight: '600', color: '#FFF', fontSize: 14 },
  quickActions: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 8 },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  emptyBills: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 13, marginTop: 8 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  welcomeSub: { fontSize: 14, marginBottom: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32 },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
