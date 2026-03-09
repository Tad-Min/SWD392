import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';

/// Secure storage wrapper for persisting auth tokens and user data.
class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService({FlutterSecureStorage? storage})
    : _storage =
          storage ??
          const FlutterSecureStorage(
            aOptions: AndroidOptions(encryptedSharedPreferences: true),
          );

  // ── Write ────────────────────────────────────────────────────
  Future<void> saveAuthData({
    required String userId,
    required int roleId,
    required String userName,
    required String token,
    required String refreshToken,
  }) async {
    await Future.wait([
      _storage.write(key: StorageKeys.userId, value: userId),
      _storage.write(key: StorageKeys.roleId, value: roleId.toString()),
      _storage.write(key: StorageKeys.userName, value: userName),
      _storage.write(key: StorageKeys.token, value: token),
      _storage.write(key: StorageKeys.refreshTokenKey, value: refreshToken),
    ]);
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: StorageKeys.token, value: token);
  }

  Future<void> saveRefreshToken(String refreshToken) async {
    await _storage.write(key: StorageKeys.refreshTokenKey, value: refreshToken);
  }

  // ── Read ─────────────────────────────────────────────────────
  Future<String?> getToken() => _storage.read(key: StorageKeys.token);
  Future<String?> getRefreshToken() =>
      _storage.read(key: StorageKeys.refreshTokenKey);
  Future<String?> getUserId() => _storage.read(key: StorageKeys.userId);
  Future<String?> getUserName() => _storage.read(key: StorageKeys.userName);

  Future<int?> getRoleId() async {
    final val = await _storage.read(key: StorageKeys.roleId);
    return val != null ? int.tryParse(val) : null;
  }

  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // ── Delete ───────────────────────────────────────────────────
  Future<void> clearAll() => _storage.deleteAll();
}

/// Provider for SecureStorageService.
final secureStorageProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});
