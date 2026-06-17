import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/bill.dart';
import '../../models/transaction.dart';
import '../../services/dashboard_service.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _service = DashboardService();
  final _amountCtl = TextEditingController();
  BillModel? _bill;
  PaymentMethodModel? _selectedMethod;
  List<PaymentMethodModel> _methods = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _bill = ModalRoute.of(context)?.settings.arguments as BillModel?;
    _loadMethods();
  }

  Future<void> _loadMethods() async {
    try {
      final data = await _service.getPaymentMethods();
      setState(() {
        _methods = (data as List).map((e) => PaymentMethodModel.fromJson(e)).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _amountCtl.dispose();
    super.dispose();
  }

  Future<void> _pay() async {
    if (_selectedMethod == null) return;
    final amount = double.tryParse(_amountCtl.text) ?? _bill?.totalAmountDue ?? 0;

    try {
      await _service.initiatePayment({
        'bill_id': _bill?.id,
        'payment_method': _selectedMethod!.code,
        'amount': amount,
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment initiated successfully!'), backgroundColor: AntecoTheme.successGreen),
      );
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment failed: $e'), backgroundColor: AntecoTheme.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Make Payment')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_bill != null)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.receipt, color: AntecoTheme.primaryBlue),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Bill ${_bill!.billingPeriod}', style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                                  Text('Due: ${_bill!.dueDate}', style: AntecoTheme.caption),
                                ],
                              ),
                            ),
                            Text('₱${_bill!.totalAmountDue.toStringAsFixed(2)}', style: AntecoTheme.amountSmall),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),
                  const Text('Payment Method', style: AntecoTheme.subtitle1),
                  const SizedBox(height: 12),
                  ..._methods.map((method) => Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: RadioListTile<PaymentMethodModel>(
                      value: method,
                      groupValue: _selectedMethod,
                      title: Text(method.name),
                      subtitle: Text(method.typeLabel),
                      secondary: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(Icons.payments, color: AntecoTheme.primaryBlue, size: 24),
                      ),
                      onChanged: (v) => setState(() => _selectedMethod = v),
                    ),
                  )),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _amountCtl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Amount',
                      prefixText: '₱ ',
                      hintText: _bill?.totalAmountDue.toStringAsFixed(2) ?? '0.00',
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: _selectedMethod == null ? null : _pay,
                      child: const Text('Proceed to Payment', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
