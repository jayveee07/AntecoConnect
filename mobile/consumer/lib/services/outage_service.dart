import 'api_service.dart';

class OutageService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>> reportOutage(Map<String, dynamic> data) async {
    return await _api.post('/outages/report', body: data);
  }

  Future<Map<String, dynamic>> getOutages({int page = 1, String? status}) async {
    final params = <String, String>{'page': '$page'};
    if (status != null) params['status'] = status;
    return await _api.get('/outages', queryParams: params);
  }

  Future<Map<String, dynamic>> trackOutage(String ticketNumber) async {
    return await _api.get('/outages/track/$ticketNumber');
  }

  Future<Map<String, dynamic>> getInterruptions() async {
    return await _api.get('/interruptions');
  }

  Future<Map<String, dynamic>> getActiveInterruptions() async {
    return await _api.get('/interruptions/active');
  }
}
