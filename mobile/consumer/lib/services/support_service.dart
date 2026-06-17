import 'api_service.dart';

class SupportService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>> getTickets({int page = 1}) async {
    return await _api.get('/support-tickets', queryParams: {'page': '$page'});
  }

  Future<Map<String, dynamic>> createTicket(Map<String, dynamic> data) async {
    return await _api.post('/support-tickets', body: data);
  }

  Future<Map<String, dynamic>> getTicketDetail(int id) async {
    return await _api.get('/support-tickets/$id');
  }

  Future<Map<String, dynamic>> sendMessage(int ticketId, String message) async {
    return await _api.post('/support-tickets/$ticketId/messages', body: {
      'message': message,
    });
  }

  Future<Map<String, dynamic>> getFaqs() async {
    return await _api.get('/faqs');
  }
}
