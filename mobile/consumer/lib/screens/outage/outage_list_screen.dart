import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/outage.dart';
import '../../services/outage_service.dart';

class OutageListScreen extends StatefulWidget {
  const OutageListScreen({super.key});

  @override
  State<OutageListScreen> createState() => _OutageListScreenState();
}

class _OutageListScreenState extends State<OutageListScreen> {
  final _service = OutageService();
  List<OutageModel> _outages = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getOutages();
      setState(() {
        _outages = (data['data'] as List).map((e) => OutageModel.fromJson(e)).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Outage Reports')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _outages.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.bolt, size: 64, color: AntecoTheme.electricYellow.withValues(alpha: 0.5)),
                      const SizedBox(height: 16),
                      const Text('No outage reports yet', style: AntecoTheme.subtitle1),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _outages.length,
                    itemBuilder: (_, i) => _buildOutageCard(_outages[i]),
                  ),
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/report-outage'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildOutageCard(OutageModel outage) {
    final statusColors = {
      'reported': AntecoTheme.warningOrange,
      'in_progress': AntecoTheme.primaryBlue,
      'resolved': AntecoTheme.successGreen,
    };
    final color = statusColors[outage.status] ?? AntecoTheme.lightGray;

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
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                child: Icon(Icons.bolt, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(outage.typeLabel, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text(outage.streetAddress, style: AntecoTheme.caption),
                    Text(outage.ticketNumber, style: AntecoTheme.caption),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                child: Text(
                  outage.status.replaceAll('_', ' '),
                  style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
