import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../domain/volunteer_models.dart';

/// API client for Volunteer feature endpoints.
/// Base: POST/GET /api/Volunteer/...
class VolunteerApi {
  final ApiClient _client;
  VolunteerApi(this._client);

  // ─── Profile ──────────────────────────────────────────────────────────────

  /// POST /api/Volunteer/register
  Future<VolunteerProfileModel> register({
    String? notes,
    String? province,
    String? ward,
  }) async {
    final response = await _client.dio.post('Volunteer/register', data: {
      'notes': notes,
      'volunteerProvince': province,
      'volunteerWard': ward,
    });
    final data = response.data['data'] ?? response.data;
    return VolunteerProfileModel.fromJson(data as Map<String, dynamic>);
  }

  /// GET /api/Volunteer/me — returns null if 404 (not yet registered).
  Future<VolunteerProfileModel?> getMyProfile() async {
    try {
      final response = await _client.dio.get('Volunteer/me');
      return VolunteerProfileModel.fromJson(
          response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) return null;
      rethrow;
    }
  }

  // ─── Skills ───────────────────────────────────────────────────────────────

  /// GET /api/Volunteer/skill-types
  Future<List<VolunteerSkillTypeModel>> getSkillTypes() async {
    final response = await _client.dio.get('Volunteer/skill-types');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) =>
            VolunteerSkillTypeModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /api/Volunteer/skills — my current skills.
  Future<List<VolunteerSkillModel>> getMySkills() async {
    final response = await _client.dio.get('Volunteer/skills');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => VolunteerSkillModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/Volunteer/skills — set skills (replaces all).
  Future<void> setSkills(List<int> skillTypeIds) async {
    await _client.dio.post('Volunteer/skills', data: {
      'skillTypeIds': skillTypeIds,
    });
  }

  // ─── Offers ───────────────────────────────────────────────────────────────

  /// GET /api/Volunteer/offer-types
  Future<List<VolunteerOfferTypeModel>> getOfferTypes() async {
    final response = await _client.dio.get('Volunteer/offer-types');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) =>
            VolunteerOfferTypeModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// POST /api/Volunteer/offers — create a new donation offer.
  Future<VolunteerOfferModel> createOffer({
    required int offerTypeId,
    required String offerName,
    required double quantity,
    required String unit,
    String? description,
    bool isReturnRequired = false,
    String? dropoffLocationText,
    double? dropoffLatitude,
    double? dropoffLongitude,
    String? contactPhone,
  }) async {
    final response = await _client.dio.post('Volunteer/offers', data: {
      'offerTypeId': offerTypeId,
      'offerName': offerName,
      'quantity': quantity,
      'unit': unit,
      'description': description,
      'isReturnRequired': isReturnRequired,
      'dropoffLocationText': dropoffLocationText,
      'dropoffLatitude': dropoffLatitude,
      'dropoffLongitude': dropoffLongitude,
      'contactPhone': contactPhone,
    });
    final data = response.data['data'] ?? response.data;
    return VolunteerOfferModel.fromJson(data as Map<String, dynamic>);
  }

  /// GET /api/Volunteer/offers/me — my donation history.
  Future<List<VolunteerOfferModel>> getMyOffers() async {
    final response = await _client.dio.get('Volunteer/offers/me');
    final list = response.data as List<dynamic>? ?? [];
    return list
        .map((e) => VolunteerOfferModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

/// Provider for VolunteerApi.
final volunteerApiProvider = Provider<VolunteerApi>((ref) {
  final client = ref.watch(apiClientProvider);
  return VolunteerApi(client);
});
