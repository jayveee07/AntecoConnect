import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/bill.dart';

class BillCard extends StatelessWidget {
  final BillHistory bill;

  const BillCard({super.key, required this.bill});

  @override
  Widget build(BuildContext context) {
    final isPaid = bill.status == 'paid';
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
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
                  color: isPaid ? AntecoTheme.successGreen.withValues(alpha: 0.1) : AntecoTheme.warningOrange.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  isPaid ? Icons.check_circle : Icons.pending,
                  color: isPaid ? AntecoTheme.successGreen : AntecoTheme.warningOrange,
                  size: 28,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(bill.billingPeriod, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 4),
                    Text('${bill.consumptionKwh.toStringAsFixed(0)} kWh', style: AntecoTheme.caption),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('₱${bill.totalAmountDue.toStringAsFixed(2)}', style: AntecoTheme.amountSmall),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: isPaid ? AntecoTheme.successGreen.withValues(alpha: 0.1) : AntecoTheme.warningOrange.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      isPaid ? 'Paid' : 'Unpaid',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isPaid ? AntecoTheme.successGreen : AntecoTheme.warningOrange,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
