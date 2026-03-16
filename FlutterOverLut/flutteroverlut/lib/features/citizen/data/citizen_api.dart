import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/constants/app_constants.dart';
import '../domain/citizen_models.dart';

/// Riverpod provider for CitizenApi.
final citizenApiProvider = Provider<CitizenApi>((ref) {
  final client = ref.watch(apiClientProvider);
  return CitizenApi(client);
});

/// Citizen API service — matches backend RescueRequest & User endpoints.
class CitizenApi {
  final ApiClient _client;

  CitizenApi(this._client);

  /// POST RescueRequest/Add
  Future<void> createRescueRequest(Map<String, dynamic> data) async {
    await _client.dio.post(ApiEndpoints.rescueRequestAdd, data: data);
  }

  /// GET RescueRequest/GetAll — returns list directly (no wrapper).
  Future<List<RescueRequestModel>> getRescueRequests({
    int? userReqId,
    int? status,
    int? urgencyLevel,
  }) async {
    // GetAll uses request body for filtering
    final filterBody = <String, dynamic>{};
    if (userReqId != null) filterBody['userReqId'] = userReqId;
    if (status != null) filterBody['status'] = status;
    if (urgencyLevel != null) filterBody['urgencyLevel'] = urgencyLevel;

    final response = await _client.dio.get(
      ApiEndpoints.rescueRequests,
      data: filterBody.isEmpty ? null : filterBody,
    );

    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => RescueRequestModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET RescueRequest/GetById/{id}
  Future<RescueRequestModel> getRescueRequestById(int id) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueRequestById}/$id',
    );
    return RescueRequestModel.fromJson(response.data as Map<String, dynamic>);
  }

  /// PUT RescueRequest/Update/{id}
  Future<void> updateRescueRequest(int id, Map<String, dynamic> data) async {
    await _client.dio.put(
      '${ApiEndpoints.rescueRequestUpdate}/$id',
      data: data,
    );
  }

  /// GET User/GetById/{id}
  Future<UserProfileModel> getUserProfile(int userId) async {
    final response = await _client.dio.get('${ApiEndpoints.userById}/$userId');
    return UserProfileModel.fromJson(response.data as Map<String, dynamic>);
  }
}
