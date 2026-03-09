import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/domain/auth_models.dart';
import '../../features/auth/presentation/auth_providers.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/auth/presentation/splash_screen.dart';
import '../../features/citizen/presentation/citizen_home_screen.dart';
import '../../features/citizen/presentation/rescue_request_screen.dart';
import '../../features/citizen/presentation/request_history_screen.dart';
import '../../features/citizen/presentation/profile_screen.dart';
import '../../features/rescue_team/presentation/rescue_team_home_screen.dart';
import '../../features/rescue_team/presentation/mission_detail_screen.dart';
import '../../features/rescue_team/presentation/vehicle_status_screen.dart';

/// A Listenable that notifies GoRouter when auth state changes.
class AuthNotifierListenable extends ChangeNotifier {
  AuthNotifierListenable(this._ref) {
    _ref.listen<AuthState>(authProvider, (_, __) {
      notifyListeners();
    });
  }
  final Ref _ref;
}

/// GoRouter provider — created ONCE, uses refreshListenable for redirect.
final routerProvider = Provider<GoRouter>((ref) {
  final authListenable = AuthNotifierListenable(ref);

  return GoRouter(
    initialLocation: '/login',
    debugLogDiagnostics: true,
    refreshListenable: authListenable,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isAuthenticated = authState.isAuthenticated;

      final isAuthRoute =
          state.matchedLocation == '/login' ||
          state.matchedLocation == '/register' ||
          state.matchedLocation == '/splash';

      // Not authenticated — go to login
      if (!isAuthenticated && !isAuthRoute) return '/login';

      // Authenticated but on auth pages — redirect to role home
      if (isAuthenticated && isAuthRoute) {
        return _roleHomePath(authState.user?.roleId);
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // ── Citizen Routes ──
      GoRoute(
        path: '/citizen',
        builder: (context, state) => const CitizenHomeScreen(),
      ),
      GoRoute(
        path: '/citizen/request',
        builder: (context, state) => const RescueRequestScreen(),
      ),
      GoRoute(
        path: '/citizen/history',
        builder: (context, state) => const RequestHistoryScreen(),
      ),
      GoRoute(
        path: '/citizen/profile',
        builder: (context, state) => const ProfileScreen(),
      ),

      // ── Rescue Team Routes ──
      GoRoute(
        path: '/rescue-team',
        builder: (context, state) => const RescueTeamHomeScreen(),
      ),
      GoRoute(
        path: '/rescue-team/mission/:id',
        builder: (context, state) =>
            MissionDetailScreen(missionId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/rescue-team/vehicles',
        builder: (context, state) => const VehicleStatusScreen(),
      ),
    ],
  );
});

/// Determine home path by role ID.
String _roleHomePath(int? roleId) {
  switch (roleId) {
    case 1:
      return '/citizen';
    case 2:
      return '/rescue-team';
    case 4:
      return '/citizen';
    case 5:
      return '/citizen';
    default:
      return '/citizen';
  }
}
