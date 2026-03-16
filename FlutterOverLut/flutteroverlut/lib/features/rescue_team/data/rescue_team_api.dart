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

  /// GET Status/Vehicles — returns list of vehicles.
  Future<List<VehicleModel>> getVehicles() async {
    final response = await _client.dio.get(ApiEndpoints.statusVehicles);
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => VehicleModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET RescueTeam/{id} — returns team with rescueTeamMembers.
  Future<RescueTeamModel> getTeamById(int teamId) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueTeamById}/$teamId',
    );
    return RescueTeamModel.fromJson(response.data as Map<String, dynamic>);
  }

  /// GET RescueTeam — returns all teams.
  Future<List<RescueTeamModel>> getAllTeams() async {
    final response = await _client.dio.get(ApiEndpoints.rescueTeams);
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => RescueTeamModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
