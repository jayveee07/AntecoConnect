import 'api_service.dart';

class ServiceRequestService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>> getRequests({int page = 1, String? status}) async {
    final params = <String, String>{'page': '$page'};
    if (status != null) params['status'] = status;
    return await _api.get('/service-requests', queryParams: params);
  }

  Future<Map<String, dynamic>> createRequest(Map<String, dynamic> data) async {
    return await _api.post('/service-requests', body: data);
  }

  Future<Map<String, dynamic>> trackRequest(int id) async {
    return await _api.get('/service-requests/$id/track');
  }

  Future<Map<String, dynamic>> cancelRequest(int id) async {
    return await _api.delete('/service-requests/$id');
  }
}
