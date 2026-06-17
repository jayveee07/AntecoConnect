import 'api_service.dart';

class DashboardService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>> getDashboard() async {
    return await _api.get('/dashboard');
  }

  Future<Map<String, dynamic>> getConsumption() async {
    return await _api.get('/consumption');
  }

  Future<Map<String, dynamic>> getMonthlyConsumption({int? year}) async {
    return await _api.get('/consumption/monthly', queryParams: year != null ? {'year': '$year'} : null);
  }

  Future<Map<String, dynamic>> getForecast() async {
    return await _api.get('/consumption/forecast');
  }

  Future<Map<String, dynamic>> getSavingTips() async {
    return await _api.get('/consumption/saving-tips');
  }

  Future<Map<String, dynamic>> getBills({int page = 1}) async {
    return await _api.get('/bills', queryParams: {'page': '$page'});
  }

  Future<Map<String, dynamic>> getCurrentBill() async {
    return await _api.get('/bills/current');
  }

  Future<Map<String, dynamic>> getBillHistory({int page = 1}) async {
    return await _api.get('/bills/history', queryParams: {'page': '$page'});
  }

  Future<Map<String, dynamic>> getActiveOutages() async {
    return await _api.get('/outages', queryParams: {'status': 'active'});
  }

  Future<Map<String, dynamic>> getPaymentMethods() async {
    return await _api.get('/payment-methods');
  }

  Future<Map<String, dynamic>> initiatePayment(Map<String, dynamic> data) async {
    return await _api.post('/payments/initiate', body: data);
  }

  Future<Map<String, dynamic>> getNotifications() async {
    return await _api.get('/notifications');
  }

  Future<void> markNotificationRead(String id) async {
    await _api.put('/notifications/$id/read');
  }

  Future<void> markAllNotificationsRead() async {
    await _api.put('/notifications/read-all');
  }
}
