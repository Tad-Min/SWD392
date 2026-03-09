import '../../../core/api/api_client.dart';
import '../../../core/constants/app_constants.dart';

/// API service for citizen rescue requests.
class CitizenApi {
  final ApiClient _client;

  CitizenApi(this._client);

  /// GET RescueRequest/GetAll
  Future<List<dynamic>> getRescueRequests() async {
    final response = await _client.dio.get(ApiEndpoints.rescueRequests);
    final data = response.data;
    if (data is Map && data.containsKey('data')) {
      return (data['data'] as List?) ?? [];
    }
    if (data is List) return data;
    return [];
  }

  /// GET RescueRequest/GetById/{id}
  Future<Map<String, dynamic>> getRescueRequestById(int id) async {
    final response = await _client.dio.get(
      '${ApiEndpoints.rescueRequestById}/$id',
    );
    final data = response.data;
    if (data is Map && data.containsKey('data')) {
      return data['data'] as Map<String, dynamic>;
    }
    return data as Map<String, dynamic>;
  }

  /// POST RescueRequest/Add
  Future<Map<String, dynamic>> createRescueRequest(
    Map<String, dynamic> body,
  ) async {
    final response = await _client.dio.post(
      ApiEndpoints.rescueRequestAdd,
      data: body,
    );
    return response.data as Map<String, dynamic>;
  }

  /// PUT RescueRequest/Update
  Future<Map<String, dynamic>> updateRescueRequest(
    Map<String, dynamic> body,
  ) async {
    final response = await _client.dio.put(
      ApiEndpoints.rescueRequestUpdate,
      data: body,
    );
    return response.data as Map<String, dynamic>;
  }

  /// GET User (current user profile)
  Future<Map<String, dynamic>> getUserProfile(String userId) async {
    final response = await _client.dio.get(
      ApiEndpoints.users,
      queryParameters: {'userId': userId},
    );
    final data = response.data;
    if (data is Map && data.containsKey('data')) {
      final list = data['data'] as List?;
      if (list != null && list.isNotEmpty)
        return list.first as Map<String, dynamic>;
    }
    if (data is List && data.isNotEmpty)
      return data.first as Map<String, dynamic>;
    return data as Map<String, dynamic>;
  }

  /// PUT User (update profile)
  Future<Map<String, dynamic>> updateUserProfile(
    Map<String, dynamic> body,
  ) async {
    final response = await _client.dio.put(ApiEndpoints.users, data: body);
    return response.data as Map<String, dynamic>;
  }
}
