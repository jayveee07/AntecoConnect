import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  String? _token;

  Future<String?> get token async {
    _token ??= await _storage.read(key: 'auth_token');
    return _token;
  }

  Future<void> setToken(String value) async {
    _token = value;
    await _storage.write(key: 'auth_token', value: value);
  }

  Future<void> clearToken() async {
    _token = null;
    await _storage.delete(key: 'auth_token');
  }

  Future<Map<String, String>> _headers() async {
    final t = await token;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (t != null) 'Authorization': 'Bearer $t',
    };
  }

  Future<dynamic> get(String endpoint, {Map<String, String>? queryParams}) async {
    final uri = Uri.parse('${AppConfig.apiBaseUrl}$endpoint')
        .replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: await _headers())
        .timeout(AppConfig.httpTimeout);
    return _handleResponse(response);
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
      headers: await _headers(),
      body: body != null ? jsonEncode(body) : null,
    ).timeout(AppConfig.httpTimeout);
    return _handleResponse(response);
  }

  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    final response = await http.put(
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
      headers: await _headers(),
      body: body != null ? jsonEncode(body) : null,
    ).timeout(AppConfig.httpTimeout);
    return _handleResponse(response);
  }

  Future<dynamic> delete(String endpoint) async {
    final response = await http.delete(
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
      headers: await _headers(),
    ).timeout(AppConfig.httpTimeout);
    return _handleResponse(response);
  }

  Future<dynamic> uploadFile(
    String endpoint, {
    required File file,
    required String fieldName,
    Map<String, String>? fields,
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('${AppConfig.apiBaseUrl}$endpoint'),
    );
    request.headers.addAll(await _headers());
    request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));
    if (fields != null) request.fields.addAll(fields);

    final response = await request.send().timeout(AppConfig.httpTimeout);
    final responseBody = await response.stream.bytesToString();
    return _handleResponse(http.Response(responseBody, response.statusCode));
  }

  dynamic _handleResponse(http.Response response) {
    final body = jsonDecode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else if (response.statusCode == 401) {
      clearToken();
      throw ApiException('Session expired. Please login again.', 401);
    } else {
      throw ApiException(
        body['message'] ?? 'Something went wrong',
        response.statusCode,
      );
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
