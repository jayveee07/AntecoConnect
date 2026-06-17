import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/outage_service.dart';

class OutageTrackingScreen extends StatefulWidget {
  const OutageTrackingScreen({super.key});

  @override
  State<OutageTrackingScreen> createState() => _OutageTrackingScreenState();
}

class _OutageTrackingScreenState extends State<OutageTrackingScreen> {
  final _ticketCtl = TextEditingController();
  final _service = OutageService();
  Map<String, dynamic>? _trackingData;
  bool _isLoading = false;

  Future<void> _track() async {
    if (_ticketCtl.text.trim().isEmpty) return;
    setState(() => _isLoading = true);
    try {
      final data = await _service.trackOutage(_ticketCtl.text.trim());
      setState(() => _trackingData = data);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$e'), backgroundColor: AntecoTheme.errorRed),
      );
    }
    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _ticketCtl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Track Outage')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ticketCtl,
                    decoration: const InputDecoration(
                      labelText: 'Ticket Number',
                      hintText: 'e.g. OTG-...',
                      prefixIcon: Icon(Icons.search),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _isLoading ? null : _track,
                  child: _isLoading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Track'),
                ),
              ],
            ),
            const SizedBox(height: 24),
            if (_trackingData != null) ...[
              _buildStatusCard(_trackingData!),
              const SizedBox(height: 16),
              _buildTimeline(_trackingData!),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(Map<String, dynamic> data) {
    final outage = data['outage'];
    final statusColors = {
      'reported': AntecoTheme.warningOrange,
      'verified': AntecoTheme.primaryBlue,
      'assigned': AntecoTheme.primaryBlue,
      'in_progress': AntecoTheme.electricYellow,
      'resolved': AntecoTheme.successGreen,
      'closed': AntecoTheme.successGreen,
    };
    final color = statusColors[outage['status']] ?? AntecoTheme.lightGray;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
              child: Icon(Icons.bolt, color: color, size: 40),
            ),
            const SizedBox(height: 16),
            Text(outage['ticket_number'] ?? '', style: AntecoTheme.subtitle1),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
              child: Text(
                (outage['status'] as String).toUpperCase().replaceAll('_', ' '),
                style: TextStyle(color: color, fontWeight: FontWeight.bold),
              ),
            ),
            if (data['estimated_restoration'] != null) ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.schedule, size: 16, color: AntecoTheme.lightGray),
                  const SizedBox(width: 6),
                  Text('Est. Restoration: ${data['estimated_restoration']}', style: AntecoTheme.body2),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTimeline(Map<String, dynamic> data) {
    final timeline = data['timeline'] as List? ?? [];
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Status Timeline', style: AntecoTheme.subtitle1),
            const SizedBox(height: 16),
            ...timeline.map((item) {
              final completed = item['completed'] ?? false;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: completed ? AntecoTheme.successGreen : AntecoTheme.lightGray.withValues(alpha: 0.3),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        completed ? Icons.check : Icons.circle,
                        size: completed ? 14 : 8,
                        color: completed ? Colors.white : AntecoTheme.lightGray,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      item['message'] ?? '',
                      style: TextStyle(
                        color: completed ? null : AntecoTheme.lightGray,
                        fontWeight: completed ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
