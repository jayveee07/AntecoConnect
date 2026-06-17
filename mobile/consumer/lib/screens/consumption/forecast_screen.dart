import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/consumption.dart';
import '../../services/dashboard_service.dart';

class ForecastScreen extends StatefulWidget {
  const ForecastScreen({super.key});

  @override
  State<ForecastScreen> createState() => _ForecastScreenState();
}

class _ForecastScreenState extends State<ForecastScreen> {
  final _service = DashboardService();
  AiForecast? _forecast;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getForecast();
      setState(() {
        _forecast = AiForecast.fromJson(data);
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Consumption Forecast')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _forecast == null
              ? const Center(child: Text('No forecast data available'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildForecastCard(),
                      const SizedBox(height: 20),
                      _buildRecommendations(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildForecastCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.auto_awesome, color: AntecoTheme.primaryBlue, size: 40),
            ),
            const SizedBox(height: 16),
            const Text('AI-Powered Prediction', style: AntecoTheme.subtitle1),
            const SizedBox(height: 8),
            const Text('Estimated Next Bill', style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
            const SizedBox(height: 8),
            Text(
              '₱${_forecast!.predictedValue.toStringAsFixed(2)}',
              style: AntecoTheme.heading1.copyWith(fontSize: 36, color: AntecoTheme.primaryBlue),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.analytics, size: 16, color: AntecoTheme.successGreen),
                const SizedBox(width: 6),
                Text('${_forecast!.confidenceScore.toStringAsFixed(0)}% confidence', style: TextStyle(color: AntecoTheme.successGreen, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 16),
            if (_forecast!.nextMonthEstimate.isNotEmpty) ...[
              const Divider(),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _forecastItem('Est. kWh', '${(_forecast!.nextMonthEstimate['consumption_kwh'] ?? 0).toStringAsFixed(0)} kWh'),
                  _forecastItem('Confidence', '${_forecast!.confidenceScore.toStringAsFixed(0)}%'),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _forecastItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: AntecoTheme.caption),
      ],
    );
  }

  Widget _buildRecommendations() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.lightbulb_outline, color: AntecoTheme.electricYellow),
                SizedBox(width: 8),
                Text('AI Recommendations', style: AntecoTheme.subtitle1),
              ],
            ),
            const SizedBox(height: 16),
            ...(_forecast!.recommendations.map((r) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle, size: 18, color: AntecoTheme.successGreen),
                  const SizedBox(width: 12),
                  Expanded(child: Text(r, style: AntecoTheme.body2)),
                ],
              ),
            ))),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/saving-tips'),
                icon: const Icon(Icons.eco),
                label: const Text('View All Saving Tips'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
