import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/storage/secure_storage_service.dart';
import '../data/auth_api.dart';
import '../data/auth_repository.dart';
import '../domain/auth_models.dart';

// ── Dependency providers ──────────────────────────────────────────

final authApiProvider = Provider<AuthApi>((ref) {
  final client = ref.watch(apiClientProvider);
  return AuthApi(client);
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final api = ref.watch(authApiProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepository(api, storage);
});

// ── Auth state provider ───────────────────────────────────────────

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthNotifier(repo);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repo;

  AuthNotifier(this._repo) : super(const AuthState());

  /// Try to restore session from secure storage.
  Future<void> tryAutoLogin() async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final user = await _repo.tryAutoLogin();
      if (user != null) {
        state = AuthState(status: AuthStatus.authenticated, user: user);
      } else {
        state = const AuthState(status: AuthStatus.unauthenticated);
      }
    } catch (_) {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  /// Login with email and password.
  Future<void> login(String email, String password) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);
    try {
      final user = await _repo.login(email: email, password: password);
      state = AuthState(status: AuthStatus.authenticated, user: user);
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        errorMessage: e.toString(),
      );
    }
  }

  /// Register a new account.
  Future<bool> register({
    required String email,
    required String phone,
    required String userName,
    required String password,
    required String confirmPassword,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);
    try {
      await _repo.register(
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
      );
      state = state.copyWith(status: AuthStatus.unauthenticated);
      return true;
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        errorMessage: e.toString(),
      );
      return false;
    }
  }

  /// Logout.
  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  /// Clear error.
  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}
