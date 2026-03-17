import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/constants/app_constants.dart';
import '../domain/rescue_team_models.dart';

/// Riverpod provider for RescueTeamApi.
final rescueTeamApiProvider = Provider<RescueTeamApi>((ref) {
  final client = ref.watch(apiClientProvider);
  return RescueTeamApi(client);
});

/// Rescue Team API service — matches backend RescueMission & Vehicle endpoints.
class RescueTeamApi {
  final ApiClient _client;

  RescueTeamApi(this._client);

  /// GET RescueMission/GetAll — returns list directly.
  Future<List<RescueMissionModel>> getMissions({
    int? statusId,
    int? teamId,
  }) async {
    final filterBody = <String, dynamic>{};
    if (statusId != null) filterBody['statusId'] = statusId;
    if (teamId != null) filterBody['teamId'] = teamId;

    final response = await _client.dio.get(
      ApiEndpoints.rescueMissions,
      data: filterBody.isEmpty ? null : filterBody,
    );

    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => RescueMissionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET RescueMission/GetById/{id}
  Future<RescueMissionModel> getMissionById(int id) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueMissionById}/$id',
    );
    return RescueMissionModel.fromJson(response.data as Map<String, dynamic>);
  }

  /// PUT RescueMission/Update
  Future<void> updateMission(Map<String, dynamic> data) async {
    await _client.dio.put(ApiEndpoints.rescueMissionUpdate, data: data);
  }

  /// GET Vehicle/Vehicle — correct endpoint for all vehicles list.
  /// Response: {"value": [...], "Count": N}
  Future<List<VehicleModel>> getVehicles() async {
    final response = await _client.dio.get(ApiEndpoints.vehicleAll);
    final data = response.data;
    List<dynamic> list;
    if (data is Map<String, dynamic> && data.containsKey('value')) {
      list = data['value'] as List<dynamic>? ?? [];
    } else if (data is List<dynamic>) {
      list = data;
    } else {
      list = [];
    }
    return list
        .map((e) => VehicleModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET Vehicle/Vehicle/{id} — returns a single vehicle.
  Future<VehicleModel?> getVehicleById(int id) async {
    try {
      final response = await _client.dio.get(
        '${ApiEndpoints.vehicleById}/$id',
      );
      return VehicleModel.fromJson(response.data as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  /// GET Vehicle/AssignVehicle/MissionId/{missionId}
  /// Returns vehicle assignments for a specific mission.
  Future<List<VehicleAssignmentModel>> getVehicleAssignmentsByMissionId(
    int missionId,
  ) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.vehicleAssignByMission}/$missionId',
    );
    final data = response.data;
    List<dynamic> list;
    if (data is Map<String, dynamic> && data.containsKey('value')) {
      list = data['value'] as List<dynamic>? ?? [];
    } else if (data is List<dynamic>) {
      list = data;
    } else {
      list = [];
    }
    return list
        .map((e) => VehicleAssignmentModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET RescueTeam/GetRescueTeamByUserId/{userId}
  /// Returns the team(s) the user belongs to.
  /// Response: {"value": [...], "Count": N}
  Future<RescueTeamModel?> getTeamByUserId(int userId) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueTeamByUserId}/$userId',
    );
    final data = response.data;

    // Handle both {"value": [...]} wrapper and plain list
    List<dynamic> list;
    if (data is Map<String, dynamic> && data.containsKey('value')) {
      list = data['value'] as List<dynamic>? ?? [];
    } else if (data is List<dynamic>) {
      list = data;
    } else {
      return null;
    }

    if (list.isEmpty) return null;
    return RescueTeamModel.fromJson(list.first as Map<String, dynamic>);
  }

  /// GET RescueTeam/GetRescueTeamMembersByTeamId/{teamId}
  /// Returns flat DTOs with {userId, teamId, roleId, fullName, email, phone}
  Future<List<TeamMemberModel>> getMembersByTeamId(int teamId) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueTeamMembersByTeamId}/$teamId',
    );
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => TeamMemberModel.fromFlatJson(e as Map<String, dynamic>))
        .toList();
  }
}

