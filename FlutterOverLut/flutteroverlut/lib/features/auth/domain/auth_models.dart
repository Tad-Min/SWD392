import '../../../core/constants/app_constants.dart';

/// User model representing authenticated user data from login response.
class UserModel {
  final String userId;
  final int roleId;
  final String userName;
  final String token;
  final String refreshToken;

  const UserModel({
    required this.userId,
    required this.roleId,
    required this.userName,
    required this.token,
    required this.refreshToken,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId']?.toString() ?? '',
      roleId: json['roleId'] as int? ?? 1,
      userName: json['userName'] as String? ?? '',
      token: json['token'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
    );
  }

  AppRole get role => AppRole.fromId(roleId);

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'roleId': roleId,
      'userName': userName,
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
