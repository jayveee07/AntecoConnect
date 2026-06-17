import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/dashboard_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final _service = DashboardService();
  List _notifications = [];
  int _unreadCount = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getNotifications();
      setState(() {
        _notifications = data['notifications']?['data'] ?? [];
        _unreadCount = data['unread_count'] ?? 0;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: () async {
                await _service.markAllNotificationsRead();
                _load();
              },
              child: const Text('Mark All Read'),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.notifications_off, size: 64, color: AntecoTheme.lightGray.withValues(alpha: 0.5)),
                      const SizedBox(height: 16),
                      const Text('No notifications', style: AntecoTheme.subtitle1),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: _notifications.length,
                    itemBuilder: (_, i) => _buildNotification(_notifications[i]),
                  ),
                ),
    );
  }

  Widget _buildNotification(Map<String, dynamic> notif) {
    final data = notif['data'] ?? {};
    final isUnread = notif['read_at'] == null;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      color: isUnread ? AntecoTheme.primaryBlue.withValues(alpha: 0.05) : null,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
          child: Icon(
            data['type'] == 'bill' ? Icons.receipt :
            data['type'] == 'outage' ? Icons.bolt :
            data['type'] == 'payment' ? Icons.payments : Icons.notifications,
            color: AntecoTheme.primaryBlue,
          ),
        ),
        title: Text(data['title'] ?? 'Notification', style: TextStyle(fontWeight: isUnread ? FontWeight.w600 : FontWeight.normal)),
        subtitle: Text(data['message'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
        trailing: isUnread
            ? Container(width: 8, height: 8, decoration: const BoxDecoration(color: AntecoTheme.primaryBlue, shape: BoxShape.circle))
            : null,
        onTap: () {},
      ),
    );
  }
}
