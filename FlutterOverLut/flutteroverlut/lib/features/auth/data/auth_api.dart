import '../../../core/api/api_client.dart';
import '../../../core/constants/app_constants.dart';

/// Auth API service — maps to .NET backend endpoints.
class AuthApi {
  final ApiClient _client;

  AuthApi(this._client);

  /// POST Auth/login
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

  /// POST Auth/Logout — requires userId + refreshToken in body.
  Future<void> logout({
    required int userId,
    required String refreshToken,
  }) async {
    await _client.dio.post(
      ApiEndpoints.logout,
      data: {
        'userId': userId,
        'refeshToken': refreshToken, // API typo: refeshToken
      },
    );
  }

  /// POST Auth/GetAccessToken
  Future<Map<String, dynamic>> refreshToken({
    required int userId,
    required String refreshToken,
  }) async {
    final response = await _client.dio.post(
      ApiEndpoints.refreshToken,
      data: {
        'userId': userId,
        'refeshToken': refreshToken, // API typo: refeshToken
      },
    );
    return response.data as Map<String, dynamic>;
  }
}
