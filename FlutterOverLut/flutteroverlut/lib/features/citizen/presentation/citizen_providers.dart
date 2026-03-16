import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/citizen_api.dart';
import '../domain/citizen_models.dart';
import '../../auth/presentation/auth_providers.dart';

// ── Async providers that fetch from real API ─────────────────────

/// Provider for rescue requests list from API.
/// Fetches all requests for the authenticated user.
final rescueRequestsProvider =
    FutureProvider.autoDispose<List<RescueRequestModel>>((ref) async {
      final api = ref.watch(citizenApiProvider);
      final authState = ref.watch(authProvider);
      final userId = authState.user?.userId;

      if (userId == null) return [];

      return api.getRescueRequests(userReqId: userId);
    });

/// Provider for user profile from API.
final userProfileProvider = FutureProvider.autoDispose<UserProfileModel?>((
  ref,
) async {
  final api = ref.watch(citizenApiProvider);
  final authState = ref.watch(authProvider);
  final userId = authState.user?.userId;

  if (userId == null) return null;

  return api.getUserProfile(userId);
});

/// Provider to track form submission loading state.
final isSubmittingProvider = StateProvider<bool>((ref) => false);
