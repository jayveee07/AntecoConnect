import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notifications';
import { colors, light, dark as darkTheme } from '../theme';

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : light;
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNotifications();
        setNotifs(data);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const handleRead = async (id) => {
    await markAsRead(id);
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleReadAll = async () => {
    await markAllAsRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (loading) {
    return <View style={[styles.center, { backgroundColor: t.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Notifications</Text>
        {notifs.some((n) => !n.read) && (
          <TouchableOpacity onPress={handleReadAll}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      {notifs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 32 }}>🔔</Text>
          <Text style={[styles.emptyText, { color: t.textSecondary }]}>No notifications yet</Text>
        </View>
      ) : notifs.map((n) => (
        <TouchableOpacity key={n.id} style={[styles.notif, { backgroundColor: n.read ? 'transparent' : '#FFF3E6' }]} onPress={() => handleRead(n.id)}>
          <View style={[styles.dot, { opacity: n.read ? 0 : 1 }]} />
          <View style={styles.notifContent}>
            <Text style={[styles.notifTitle, { color: t.text }]}>{n.title || 'Notification'}</Text>
            {n.body && <Text style={[styles.notifBody, { color: t.textSecondary }]}>{n.body}</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800' },
  markAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  notif: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6, marginRight: 12 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '600' },
  notifBody: { fontSize: 13, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, marginTop: 8 },
});
