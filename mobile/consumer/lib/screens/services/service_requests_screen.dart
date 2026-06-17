import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/service_request_service.dart';

class ServiceRequestsScreen extends StatefulWidget {
  const ServiceRequestsScreen({super.key});

  @override
  State<ServiceRequestsScreen> createState() => _ServiceRequestsScreenState();
}

class _ServiceRequestsScreenState extends State<ServiceRequestsScreen> {
  final _service = ServiceRequestService();
  List _requests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getRequests();
      setState(() {
        _requests = data['data'] ?? [];
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Service Requests')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.assignment, size: 64, color: AntecoTheme.lightGray.withValues(alpha: 0.5)),
                      const SizedBox(height: 16),
                      const Text('No service requests yet', style: AntecoTheme.subtitle1),
                      const SizedBox(height: 8),
                      const Text('Submit a new connection or service request', style: AntecoTheme.caption),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _requests.length,
                    itemBuilder: (_, i) => _buildRequestCard(_requests[i]),
                  ),
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/create-service-request'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildRequestCard(Map<String, dynamic> req) {
    final typeLabels = {
      'new_connection': 'New Connection', 'reconnection': 'Reconnection',
      'change_ownership': 'Change Ownership', 'meter_transfer': 'Meter Transfer',
      'service_upgrade': 'Service Upgrade', 'temporary_connection': 'Temporary Connection',
    };
    final statusColors = {
      'submitted': AntecoTheme.warningOrange,
      'under_review': AntecoTheme.primaryBlue,
      'approved': AntecoTheme.successGreen,
      'rejected': AntecoTheme.errorRed,
      'completed': AntecoTheme.successGreen,
      'cancelled': AntecoTheme.lightGray,
    };

    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: (statusColors[req['status']] ?? AntecoTheme.lightGray).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.description, color: statusColors[req['status']] ?? AntecoTheme.lightGray),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(typeLabels[req['type']] ?? req['type'] ?? '', style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('Ref: ${req['request_number'] ?? ''}', style: AntecoTheme.caption),
                    if (req['created_at'] != null) Text('Submitted: ${req['created_at']}', style: AntecoTheme.caption),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: (statusColors[req['status']] ?? AntecoTheme.lightGray).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  (req['status'] ?? '').replaceAll('_', ' '),
                  style: TextStyle(fontSize: 11, color: statusColors[req['status']] ?? AntecoTheme.lightGray, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
