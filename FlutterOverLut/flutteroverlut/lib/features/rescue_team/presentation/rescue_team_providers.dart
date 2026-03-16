import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/presentation/auth_providers.dart';
import '../data/rescue_team_api.dart';
import '../domain/rescue_team_models.dart';

// ── Async providers that fetch from real API ─────────────────────

/// Provider for rescue missions list from API.
final missionsProvider = FutureProvider.autoDispose<List<RescueMissionModel>>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  return api.getMissions();
});

/// Provider for vehicles list from API.
final vehiclesProvider = FutureProvider.autoDispose<List<VehicleModel>>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  return api.getVehicles();
});

/// Provider for the current user's rescue team.
final currentTeamProvider = FutureProvider.autoDispose<RescueTeamModel?>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  final authState = ref.watch(authProvider);
  final userId = authState.user?.userId;
  
  if (userId == null) return null;

  final allTeams = await api.getAllTeams();
  
  // Find the team where this user is a member
  for (final team in allTeams) {
    for (final member in team.members) {
      if (member.userId == userId) {
        return team;
      }
    }
  }
  
  return null;
});
