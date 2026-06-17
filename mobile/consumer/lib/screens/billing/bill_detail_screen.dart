import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/bill.dart';

class BillDetailScreen extends StatelessWidget {
  const BillDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bill = ModalRoute.of(context)?.settings.arguments as BillModel?;

    return Scaffold(
      appBar: AppBar(title: Text('Bill ${bill?.billingPeriod ?? ''}')),
      body: bill == null
          ? const Center(child: Text('No bill selected'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildBillHeader(bill),
                  const SizedBox(height: 20),
                  _buildMeterReading(bill),
                  const SizedBox(height: 20),
                  _buildBreakdown(bill),
                  const SizedBox(height: 20),
                  _buildActions(context, bill),
                ],
              ),
            ),
    );
  }

  Widget _buildBillHeader(BillModel bill) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                bill.isPaid ? Icons.check_circle : Icons.receipt_long,
                size: 48,
                color: bill.isPaid ? AntecoTheme.successGreen : AntecoTheme.primaryBlue,
              ),
            ),
            const SizedBox(height: 16),
            Text('Amount Due', style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
            const SizedBox(height: 8),
            Text('₱${bill.totalAmountDue.toStringAsFixed(2)}', style: AntecoTheme.heading1.copyWith(fontSize: 36)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: bill.isPaid ? AntecoTheme.successGreen.withValues(alpha: 0.1) : AntecoTheme.warningOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                bill.status.toUpperCase(),
                style: TextStyle(
                  color: bill.isPaid ? AntecoTheme.successGreen : AntecoTheme.warningOrange,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMeterReading(BillModel bill) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Meter Reading', style: AntecoTheme.subtitle1),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _readingTile('Previous', '${bill.previousReading.toStringAsFixed(0)} kWh')),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Icon(Icons.arrow_forward, color: AntecoTheme.primaryBlue.withValues(alpha: 0.5)),
                ),
                Expanded(child: _readingTile('Current', '${bill.currentReading.toStringAsFixed(0)} kWh')),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total Consumption', style: AntecoTheme.body2),
                Text('${bill.consumptionKwh.toStringAsFixed(0)} kWh', style: AntecoTheme.subtitle1.copyWith(color: AntecoTheme.primaryBlue)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _readingTile(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(label, style: AntecoTheme.caption),
          const SizedBox(height: 4),
          Text(value, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildBreakdown(BillModel bill) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Billing Breakdown', style: AntecoTheme.subtitle1),
            const SizedBox(height: 16),
            ...bill.breakdown.entries.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(entry.key, style: AntecoTheme.body2),
                  Text('₱${entry.value.toStringAsFixed(2)}', style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                ],
              ),
            )),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Amount Due', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('₱${bill.totalAmountDue.toStringAsFixed(2)}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AntecoTheme.primaryBlue)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActions(BuildContext context, BillModel bill) {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => Navigator.pushNamed(context, '/payments', arguments: bill),
            icon: const Icon(Icons.payments),
            label: const Text('Pay Now'),
          ),
        ),
        if (!bill.isPaid) ...[
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.download),
              label: const Text('Download PDF'),
            ),
          ),
        ],
      ],
    );
  }
}
