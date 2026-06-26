import 'package:flutter/material.dart';
import '../services/dashboard_service.dart';
import '../models/bill.dart';
import '../models/outage.dart';
import '../models/consumption.dart';
import '../models/transaction.dart';

class DashboardProvider extends ChangeNotifier {
  final DashboardService _service = DashboardService();

  Map<String, dynamic>? _dashboardData;
  BillModel? _currentBill;
  List<BillHistory> _billHistory = [];
  List<ConsumptionData> _monthlyConsumption = [];
  List<OutageModel> _activeOutages = [];
  List<InterruptionNotice> _interruptions = [];
  List<TransactionModel> _recentTransactions = [];
  List<PaymentMethodModel> _paymentMethods = [];
  AiForecast? _forecast;
  List<EnergySavingTip> _savingTips = [];

  bool _isLoading = false;
  String? _error;

  Map<String, dynamic>? get dashboardData => _dashboardData;
  BillModel? get currentBill => _currentBill;
  List<BillHistory> get billHistory => _billHistory;
  List<ConsumptionData> get monthlyConsumption => _monthlyConsumption;
  List<InterruptionNotice> get interruptions => _interruptions;
  List<PaymentMethodModel> get paymentMethods => _paymentMethods;
  AiForecast? get forecast => _forecast;
  List<EnergySavingTip> get savingTips => _savingTips;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadDashboard() async {
    _isLoading = true;
    notifyListeners();

    try {
      _dashboardData = await _service.getDashboard();
      if (_dashboardData?['current_bill'] != null) {
        _currentBill = BillModel.fromJson(_dashboardData!['current_bill']);
      }
      if (_dashboardData?['recent_bills'] != null) {
        _billHistory = (_dashboardData!['recent_bills'] as List)
            .map((e) => BillHistory.fromJson(e))
            .toList();
      }
      if (_dashboardData?['consumption']?['monthly'] != null) {
        _monthlyConsumption = (_dashboardData!['consumption']['monthly'] as List)
            .map((e) => ConsumptionData.fromJson(e))
            .toList();
      }
      if (_dashboardData?['upcoming_interruptions'] != null) {
        _interruptions = (_dashboardData!['upcoming_interruptions'] as List)
            .map((e) => InterruptionNotice.fromJson(e))
            .toList();
      }
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadBills() async {
    try {
      final data = await _service.getBills();
      _billHistory = (data['data'] as List)
          .map((e) => BillHistory.fromJson(e))
          .toList();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> loadForecast() async {
    try {
      final data = await _service.getForecast();
      _forecast = AiForecast.fromJson(data);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> loadPaymentMethods() async {
    try {
      final data = await _service.getPaymentMethods();
      final list = data['data'] ?? data;
      _paymentMethods = (list is List
          ? list
          : data is List ? data : []
      ).map((e) => PaymentMethodModel.fromJson(e)).toList();
      notifyListeners();
    } catch (_) {}
  }
}
