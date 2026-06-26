import 'api_service.dart';
import '../models/user.dart';

class AuthService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _api.post('/auth/login', body: {
      'email': email,
      'password': password,
    });

    await _api.setToken(response['token']);
    return response;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await _api.post('/auth/register', body: data);
    await _api.setToken(response['token']);
    return response;
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {}
    await _api.clearToken();
  }

  Future<UserModel> getProfile() async {
    final response = await _api.get('/profile');
    return UserModel.fromJson(response);
  }

  Future<void> sendEmailOtp(String email) async {
    await _api.post('/otp/send-email', body: {'email': email});
  }

  Future<void> verifyEmailOtp(String email, String otp) async {
    await _api.post('/otp/verify-email', body: {
      'email': email,
      'otp_code': otp,
    });
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    return await _api.put('/profile', body: data);
  }

  Future<void> changePassword(String current, String newPassword) async {
    await _api.put('/profile/change-password', body: {
      'current_password': current,
      'new_password': newPassword,
      'new_password_confirmation': newPassword,
    });
  }
}
