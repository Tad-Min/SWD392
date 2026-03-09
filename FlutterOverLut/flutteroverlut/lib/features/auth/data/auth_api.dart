import '../../../core/api/api_client.dart';
import '../../../core/constants/app_constants.dart';

/// Auth API service — maps directly from web's authApi.js
class AuthApi {
  final ApiClient _client;

  AuthApi(this._client);

  /// POST Auth/Login
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _client.dio.post(
      ApiEndpoints.login,
      data: {'email': email, 'password': password},
    );
    return response.data as Map<String, dynamic>;
  }

  /// POST Auth/Register
  Future<Map<String, dynamic>> register({
    required String email,
    required String phone,
    required String userName,
    required String password,
    required String confirmPassword,
  }) async {
    final response = await _client.dio.post(
      ApiEndpoints.register,
      data: {
        'email': email,
        'phone': phone,
        'userName': userName,
        'password': password,
        'confirmPassword': confirmPassword,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  /// POST Auth/Logout
  Future<void> logout() async {
    await _client.dio.post(ApiEndpoints.logout);
  }

  /// POST Auth/RefreshToken
  Future<Map<String, dynamic>> refreshToken() async {
    final response = await _client.dio.post(ApiEndpoints.refreshToken);
    return response.data as Map<String, dynamic>;
  }
}
