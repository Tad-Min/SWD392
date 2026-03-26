import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/volunteer_api.dart';
import '../domain/volunteer_models.dart';

/// My volunteer profile — returns null if not yet registered.
final myVolunteerProfileProvider =
    FutureProvider.autoDispose<VolunteerProfileModel?>((ref) async {
  final api = ref.watch(volunteerApiProvider);
  return api.getMyProfile();
});

/// All available skill types from backend.
final skillTypesProvider =
    FutureProvider.autoDispose<List<VolunteerSkillTypeModel>>((ref) async {
  final api = ref.watch(volunteerApiProvider);
  return api.getSkillTypes();
});

/// My current skills.
final mySkillsProvider =
    FutureProvider.autoDispose<List<VolunteerSkillModel>>((ref) async {
  final api = ref.watch(volunteerApiProvider);
  return api.getMySkills();
});

/// All available offer types from backend.
final offerTypesProvider =
    FutureProvider.autoDispose<List<VolunteerOfferTypeModel>>((ref) async {
  final api = ref.watch(volunteerApiProvider);
  return api.getOfferTypes();
});

/// My donation offers history.
final myOffersProvider =
    FutureProvider.autoDispose<List<VolunteerOfferModel>>((ref) async {
  final api = ref.watch(volunteerApiProvider);
  return api.getMyOffers();
});
