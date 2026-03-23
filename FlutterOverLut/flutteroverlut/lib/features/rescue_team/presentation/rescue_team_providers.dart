import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/presentation/auth_providers.dart';
import '../data/rescue_team_api.dart';
import '../domain/rescue_team_models.dart';

// ── Async providers that fetch from real API ─────────────────────

/// Provider for all rescue missions (unfiltered — for admin/coordinator views).
final missionsProvider = FutureProvider.autoDispose<List<RescueMissionModel>>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  return api.getMissions();
});

/// Provider for missions belonging to the current user's team only.
/// Uses GetByTeamId endpoint after resolving teamId from currentTeamProvider.
final teamMissionsProvider =
    FutureProvider.autoDispose<List<RescueMissionModel>>((ref) async {
  final api = ref.watch(rescueTeamApiProvider);
  final team = await ref.watch(currentTeamProvider.future);
  if (team == null || team.teamId == null) return [];
  return api.getMissions(teamId: team.teamId);
});

/// Provider for vehicles list from API (all vehicles).
final vehiclesProvider = FutureProvider.autoDispose<List<VehicleModel>>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  return api.getVehicles();
});

/// Provider for vehicles assigned to the current team's active missions.
/// Flow: team → missions (by teamId) → vehicle assignments → unique vehicles.
final teamVehiclesProvider = FutureProvider.autoDispose<List<VehicleModel>>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  final teamAsync = await ref.watch(currentTeamProvider.future);
  if (teamAsync == null || teamAsync.teamId == null) return [];

  // Step 1: Get missions for this team
  final missions = await api.getMissions(teamId: teamAsync.teamId);
  if (missions.isEmpty) return [];

  // Step 2: For each mission, get vehicle assignments (run in parallel)
  final assignmentFutures = missions
      .where((m) => m.missionId != null)
      .map((m) => api.getVehicleAssignmentsByMissionId(m.missionId!));
  final nestedAssignments = await Future.wait(assignmentFutures);
  final allAssignments = nestedAssignments.expand((a) => a).toList();

  // Step 3: Collect unique vehicleIds and fetch vehicle details
  final vehicleIds = allAssignments
      .where((a) => a.vehicleId != null)
      .map((a) => a.vehicleId!)
      .toSet();
  if (vehicleIds.isEmpty) return [];

  final vehicleFutures = vehicleIds.map((id) => api.getVehicleById(id));
  final vehicles = await Future.wait(vehicleFutures);
  return vehicles.whereType<VehicleModel>().toList();
});

/// Provider for the current user's rescue team (with members loaded).
final currentTeamProvider = FutureProvider.autoDispose<RescueTeamModel?>((
  ref,
) async {
  final api = ref.watch(rescueTeamApiProvider);
  final authState = ref.watch(authProvider);
  final userId = authState.user?.userId;

  if (userId == null) return null;

  // Step 1: Find which team this user belongs to
  final team = await api.getTeamByUserId(userId);
  if (team == null || team.teamId == null) return null;

  // Step 2: Fetch all members of that team (with user details via .Include)
  final members = await api.getMembersByTeamId(team.teamId!);

  // Return the team with members attached
  return RescueTeamModel(
    teamId: team.teamId,
    teamName: team.teamName,
    statusId: team.statusId,
    isActive: team.isActive,
    createdAt: team.createdAt,
    members: members,
  );
});
