import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/consumption.dart';
import '../../services/dashboard_service.dart';

class ConsumptionScreen extends StatefulWidget {
  const ConsumptionScreen({super.key});

  @override
  State<ConsumptionScreen> createState() => _ConsumptionScreenState();
}

class _ConsumptionScreenState extends State<ConsumptionScreen> {
  final _service = DashboardService();
  Map<String, dynamic>? _data;
  bool _isLoading = true;
  String _viewMode = 'monthly';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getConsumption();
      setState(() {
        _data = data;
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
        title: const Text('Energy Consumption'),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.calendar_month),
            onSelected: (v) => setState(() => _viewMode = v),
            itemBuilder: (_) => ['daily', 'weekly', 'monthly', 'yearly']
                .map((m) => PopupMenuItem(value: m, child: Text(m.toUpperCase())))
                .toList(),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _data == null
              ? const Center(child: Text('No data available'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildSummaryCards(),
                      const SizedBox(height: 20),
                      _buildConsumptionChart(),
                      const SizedBox(height: 20),
                      _buildHistoricalData(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildSummaryCards() {
    final current = _data!['current_month'];
    final last = _data!['last_month'];
    final avg = _data!['average_monthly_kwh'] ?? 0;

    return Row(
      children: [
        Expanded(child: _summaryCard('Current', '${current?['consumption_kwh']?.toStringAsFixed(0) ?? 0} kWh', AntecoTheme.primaryBlue, Icons.electric_bolt)),
        const SizedBox(width: 12),
        Expanded(child: _summaryCard('Last Month', '${last?['consumption_kwh']?.toStringAsFixed(0) ?? 0} kWh', AntecoTheme.warningOrange, Icons.compare_arrows)),
        const SizedBox(width: 12),
        Expanded(child: _summaryCard('Avg Monthly', '${avg.toStringAsFixed(0)} kWh', AntecoTheme.successGreen, Icons.trending_up)),
      ],
    );
  }

  Widget _summaryCard(String label, String value, Color color, IconData icon) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: color)),
            const SizedBox(height: 4),
            Text(label, style: AntecoTheme.caption),
          ],
        ),
      ),
    );
  }

  Widget _buildConsumptionChart() {
    final yearlyData = _data!['yearly_data'] as List? ?? [];
    if (yearlyData.isEmpty) return const SizedBox.shrink();

    final maxKwh = yearlyData.fold<double>(0, (m, d) => (d['consumption_kwh'] ?? 0) > m ? (d['consumption_kwh'] ?? 0).toDouble() : m);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('12-Month Trend', style: AntecoTheme.subtitle1),
                Text('Total: ${_data!['total_kwh_year']?.toStringAsFixed(0) ?? 0} kWh', style: AntecoTheme.caption),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 180,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: yearlyData.asMap().entries.map((entry) {
                  final kwh = (entry.value['consumption_kwh'] ?? 0).toDouble();
                  final height = maxKwh > 0 ? (kwh / maxKwh) * 150 : 0.0;
                  final monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  final month = entry.value['period_month'] ?? 1;
                  return Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text('${kwh.toStringAsFixed(0)}', style: const TextStyle(fontSize: 8, color: AntecoTheme.lightGray)),
                          const SizedBox(height: 2),
                          Container(
                            height: height.clamp(4, 150),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                begin: Alignment.bottomCenter, end: Alignment.topCenter,
                                colors: [AntecoTheme.primaryBlue, AntecoTheme.primaryLight],
                              ),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(monthNames[(month - 1) % 12], style: const TextStyle(fontSize: 9, color: AntecoTheme.lightGray)),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoricalData() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Consumption Insights', style: AntecoTheme.subtitle1),
            const SizedBox(height: 12),
            _insightRow(Icons.bolt, 'Current Month Usage', '${_data!['current_month']?['consumption_kwh']?.toStringAsFixed(0) ?? 0} kWh'),
            const Divider(height: 16),
            _insightRow(Icons.trending_up, 'Average Daily', '${(_data!['current_month']?['consumption_kwh'] ?? 0 / 30).toStringAsFixed(1)} kWh/day'),
            const Divider(height: 16),
            _insightRow(Icons.account_balance_wallet, 'Estimated Bill', '₱${_data!['estimated_bill']?['total']?.toStringAsFixed(2) ?? '0.00'}'),
            const Divider(height: 16),
            _insightRow(Icons.compare_arrows, 'vs Last Month', _data!['last_month'] != null
                ? '${(((_data!['current_month']?['consumption_kwh'] ?? 0) - (_data!['last_month']?['consumption_kwh'] ?? 0)) / (_data!['last_month']?['consumption_kwh'] ?? 1) * 100).toStringAsFixed(1)}%'
                : 'N/A'),
          ],
        ),
      ),
    );
  }

  Widget _insightRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AntecoTheme.primaryBlue),
          const SizedBox(width: 12),
          Expanded(child: Text(label, style: AntecoTheme.body2)),
          Text(value, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
