import 'package:dio/dio.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../domain/auth_models.dart';
import 'auth_api.dart';

/// Repository bridging AuthApi and local storage.
class AuthRepository {
  final AuthApi _api;
  final SecureStorageService _storage;

  AuthRepository(this._api, this._storage);

  /// Login and persist auth data to secure storage.
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final data = await _api.login(email: email, password: password);
      final user = UserModel.fromJson(data);

      await _storage.saveAuthData(
        userId: user.userId.toString(),
        roleId: user.roleId,
        userName: user.fullName,
        token: user.token,
        refreshToken: user.refreshToken,
      );

      return user;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Register a new citizen account.
  Future<void> register({
    required String email,
    required String phone,
    required String userName,
    required String password,
    required String confirmPassword,
  }) async {
    try {
      await _api.register(
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Logout and clear local storage.
  Future<void> logout() async {
    try {
      final userIdStr = await _storage.getUserId();
      final refreshToken = await _storage.getRefreshToken();
      if (userIdStr != null && refreshToken != null) {
        await _api.logout(
          userId: int.tryParse(userIdStr) ?? 0,
          refreshToken: refreshToken,
        );
      }
    } catch (_) {
      // Ignore server errors on logout — still clear locally
    }
    await _storage.clearAll();
  }

  /// Check if user has a saved session.
  Future<UserModel?> tryAutoLogin() async {
    final hasToken = await _storage.hasToken();
    if (!hasToken) return null;

    final userId = await _storage.getUserId();
    final roleId = await _storage.getRoleId();
    final userName = await _storage.getUserName();
    final token = await _storage.getToken();
    final refreshToken = await _storage.getRefreshToken();

    if (userId == null || roleId == null || token == null) return null;

    return UserModel(
      userId: int.tryParse(userId) ?? 0,
      roleId: roleId,
      fullName: userName ?? '',
      token: token,
      refreshToken: refreshToken ?? '',
    );
  }

  /// Parse DioException into user-friendly error message.
  /// Handles .NET validation errors like the web does.
  String _handleDioError(DioException e) {
    final statusCode = e.response?.statusCode;
    final data = e.response?.data;

    // Handle plain string response (e.g., "User not found!")
    if (data is String && data.isNotEmpty) {
      return data;
    }

    if (data is Map<String, dynamic>) {
      // .NET validation errors: { "errors": { "Email": ["..."] } }
      if (data.containsKey('errors')) {
        final errors = data['errors'] as Map<String, dynamic>;
        final firstKey = errors.keys.first;
        final list = errors[firstKey];
        if (list is List && list.isNotEmpty) {
          return list.first.toString();
        }
      }
      // Simple message or ProblemDetails (title/detail/message keys)
      for (final key in ['message', 'title', 'detail']) {
        if (data.containsKey(key) && data[key] != null) {
          return data[key].toString();
        }
      }
    }

    switch (statusCode) {
      case 400:
        return 'Thông tin đăng nhập không hợp lệ.';
      case 401:
        return 'Sai email hoặc mật khẩu.';
      case 403:
        return 'Bạn không có quyền truy cập.';
      case 404:
        return 'Không tìm thấy tài khoản.';
      case 500:
        return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }

    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Kết nối hết thời gian. Vui lòng thử lại.';
      case DioExceptionType.connectionError:
        return 'Không thể kết nối đến máy chủ.';
      default:
        return 'Đã xảy ra lỗi. Vui lòng thử lại.';
    }
  }
}

