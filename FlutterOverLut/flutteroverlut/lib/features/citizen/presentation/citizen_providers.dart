import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/citizen_models.dart';

// ── Mock data for UI development ──────────────────────────────────

final List<RescueRequestModel> mockRequests = [
  RescueRequestModel(
    id: 1,
    description: 'Nước dâng cao, 5 người mắc kẹt tầng 2',
    location: 'Quận 7, TP.HCM',
    urgencyLevel: 4,
    status: 1,
    numberOfPeople: 5,
    contactPhone: '0912345678',
    createdAt: DateTime.now()
        .subtract(const Duration(hours: 2))
        .toIso8601String(),
  ),
  RescueRequestModel(
    id: 2,
    description: 'Cần thực phẩm và nước uống cho 10 hộ dân',
    location: 'Quận 8, TP.HCM',
    urgencyLevel: 3,
    status: 0,
    numberOfPeople: 30,
    contactPhone: '0987654321',
    createdAt: DateTime.now()
        .subtract(const Duration(hours: 5))
        .toIso8601String(),
  ),
  RescueRequestModel(
    id: 3,
    description: 'Người già cần sơ tán khẩn cấp',
    location: 'Bình Chánh, TP.HCM',
    urgencyLevel: 4,
    status: 2,
    numberOfPeople: 2,
    contactPhone: '0909123456',
    createdAt: DateTime.now()
        .subtract(const Duration(days: 1))
        .toIso8601String(),
  ),
  RescueRequestModel(
    id: 4,
    description: 'Nhà bị ngập, cần hỗ trợ di dời đồ đạc',
    location: 'Thủ Đức, TP.HCM',
    urgencyLevel: 2,
    status: 2,
    numberOfPeople: 4,
    contactPhone: '0938765432',
    createdAt: DateTime.now()
        .subtract(const Duration(days: 3))
        .toIso8601String(),
  ),
];

/// Provider for mock rescue requests list.
final rescueRequestsProvider = StateProvider<List<RescueRequestModel>>((ref) {
  return mockRequests;
});

/// Provider to track form submission loading state.
final isSubmittingProvider = StateProvider<bool>((ref) => false);
