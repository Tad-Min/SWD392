import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../storage/secure_storage_service.dart';

/// Configuration for the API client.
class ApiConfig {
  ApiConfig._();

  static String get baseUrl {
    // Android emulator: 10.0.2.2 maps to host machine's localhost.
    // Backend is now running on port 5000.
    return 'http://10.0.2.2:5000/api/';
  }

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
}

/// Dio HTTP client with auth token interceptor.
class ApiClient {
  late final Dio dio;
  final SecureStorageService _storage;

  ApiClient(this._storage) {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.baseUrl,
        connectTimeout: ApiConfig.connectTimeout,
        receiveTimeout: ApiConfig.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(_authInterceptor());
    dio.interceptors.add(_loggingInterceptor());
  }

  /// Attach Bearer token to every request automatically.
  InterceptorsWrapper _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        // Auto-refresh token on 401
        if (error.response?.statusCode == 401) {
          try {
            final refreshed = await _tryRefreshToken();
            if (refreshed) {
              // Retry the original request
              final retryResponse = await _retry(error.requestOptions);
              return handler.resolve(retryResponse);
            }
          } catch (_) {
            // Refresh failed — clear auth and let error propagate
            await _storage.clearAll();
          }
        }
        handler.next(error);
      },
    );
  }

  /// Logging interceptor for debug.
  LogInterceptor _loggingInterceptor() {
    return LogInterceptor(
      requestBody: true,
      responseBody: true,
      logPrint: (obj) => print('[API] $obj'),
    );
  }

  /// Try to refresh the access token.
  Future<bool> _tryRefreshToken() async {
    final refreshToken = await _storage.getRefreshToken();
    final userId = await _storage.getUserId();
    if (refreshToken == null || userId == null) return false;

    try {
      // Use a separate Dio instance to avoid interceptor loops
      final refreshDio = Dio(
        BaseOptions(
          baseUrl: ApiConfig.baseUrl,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ),
      );
      final response = await refreshDio.post(
        'Auth/GetAccessToken',
        data: {
          'userId': int.tryParse(userId) ?? 0,
          'refeshToken': refreshToken, // API typo: refeshToken
        },
      );

      final data = response.data;
      if (data is Map<String, dynamic>) {
        final newToken = data['token'] as String?;
        final newRefreshToken = data['refreshToken'] as String?;

        if (newToken != null) {
          await _storage.saveToken(newToken);
          if (newRefreshToken != null) {
            await _storage.saveRefreshToken(newRefreshToken);
          }
          return true;
        }
      }
    } catch (_) {
      // Refresh failed
    }
    return false;
  }

  /// Retry a failed request with the new token.
  Future<Response<dynamic>> _retry(RequestOptions requestOptions) async {
    final token = await _storage.getToken();
    final options = Options(
      method: requestOptions.method,
      headers: {...requestOptions.headers, 'Authorization': 'Bearer $token'},
    );
    return dio.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }
}

/// Provider for the API client.
final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return ApiClient(storage);
});
