import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/consumption.dart';
import '../../services/dashboard_service.dart';

class SavingTipsScreen extends StatefulWidget {
  const SavingTipsScreen({super.key});

  @override
  State<SavingTipsScreen> createState() => _SavingTipsScreenState();
}

class _SavingTipsScreenState extends State<SavingTipsScreen> {
  final _service = DashboardService();
  List<EnergySavingTip> _tips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getSavingTips();
      setState(() {
        _tips = (data as List).map((e) => EnergySavingTip.fromJson(e)).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Energy Saving Tips')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _tips.length,
              itemBuilder: (_, i) => _buildTipCard(_tips[i]),
            ),
    );
  }

  Widget _buildTipCard(EnergySavingTip tip) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AntecoTheme.successGreen.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.eco, color: AntecoTheme.successGreen, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(tip.title, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                ),
                if (tip.estimatedSavings != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AntecoTheme.electricYellow.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Save ${tip.estimatedSavings!.toStringAsFixed(0)}%',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AntecoTheme.warningOrange),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(tip.description, style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text('Difficulty: ${tip.difficulty}', style: AntecoTheme.caption),
            ),
          ],
        ),
      ),
    );
  }
}
