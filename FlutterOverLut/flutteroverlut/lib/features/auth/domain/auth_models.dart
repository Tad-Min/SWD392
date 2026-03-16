import '../../../core/constants/app_constants.dart';

/// User model representing authenticated user data from login response.
class UserModel {
  final int userId;
  final int roleId;
  final String fullName;
  final String token;
  final String refreshToken;

  const UserModel({
    required this.userId,
    required this.roleId,
    required this.fullName,
    required this.token,
    required this.refreshToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'] as int? ?? 0,
      roleId: json['roleId'] as int? ?? 1,
      fullName:
          json['fullName'] as String? ?? json['userName'] as String? ?? '',
      token: json['token'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
    );
  }

  /// Convenience getter used by UI (backward compat with old `userName` refs).
  String get userName => fullName;

  AppRole get role => AppRole.fromId(roleId);

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'roleId': roleId,
      'fullName': fullName,
      'token': token,
      'refreshToken': refreshToken,
    };
  }
}

/// Represents the current authentication state.
enum AuthStatus { initial, authenticated, unauthenticated, loading }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.errorMessage,
  });

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage,
    );
  }

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isLoading => status == AuthStatus.loading;
}
