import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/rescue_team_models.dart';

// ── Mock missions for UI development ──────────────────────────────

final List<RescueMissionModel> mockMissions = [
  RescueMissionModel(
    id: 1,
    missionName: 'Cứu trợ khu vực Quận 7',
    description:
        'Di chuyển 5 hộ dân bị mắc kẹt tại khu chung cư. Nước dâng cao 1.5m, cần canô và áo phao.',
    location: 'Quận 7, TP.HCM',
    status: 1,
    teamName: 'Đội Alpha',
    numberOfPeople: 15,
    startTime: DateTime.now()
        .subtract(const Duration(hours: 3))
        .toIso8601String(),
    createdAt: DateTime.now()
        .subtract(const Duration(hours: 4))
        .toIso8601String(),
  ),
  RescueMissionModel(
    id: 2,
    missionName: 'Hỗ trợ khu vực Bình Chánh',
    description:
        'Cung cấp thực phẩm và nước sạch cho 30 hộ dân bị cô lập. Cần xe tải và xuồng.',
    location: 'Bình Chánh, TP.HCM',
    status: 0,
    teamName: 'Đội Alpha',
    numberOfPeople: 80,
    createdAt: DateTime.now()
        .subtract(const Duration(hours: 1))
        .toIso8601String(),
  ),
  RescueMissionModel(
    id: 3,
    missionName: 'Sơ tán khu vực Nhà Bè',
    description:
        'Sơ tán toàn bộ dân cư tại khu vực ven sông. Đã hoàn thành di dời 42 người an toàn.',
    location: 'Nhà Bè, TP.HCM',
    status: 2,
    teamName: 'Đội Alpha',
    numberOfPeople: 42,
    startTime: DateTime.now()
        .subtract(const Duration(days: 1))
        .toIso8601String(),
    endTime: DateTime.now()
        .subtract(const Duration(hours: 18))
        .toIso8601String(),
    createdAt: DateTime.now()
        .subtract(const Duration(days: 1, hours: 2))
        .toIso8601String(),
  ),
];

final List<VehicleModel> mockVehicles = [
  VehicleModel(
    id: 1,
    vehicleName: 'Canô cứu hộ 01',
    vehicleType: 'Canô',
    licensePlate: 'SG-001',
    capacity: 8,
    status: 1,
  ),
  VehicleModel(
    id: 2,
    vehicleName: 'Xe tải viện trợ',
    vehicleType: 'Xe tải',
    licensePlate: '59C-12345',
    capacity: 20,
    status: 0,
  ),
  VehicleModel(
    id: 3,
    vehicleName: 'Xuồng cao tốc 02',
    vehicleType: 'Xuồng',
    licensePlate: 'SG-002',
    capacity: 6,
    status: 0,
  ),
  VehicleModel(
    id: 4,
    vehicleName: 'Canô cứu hộ 03',
    vehicleType: 'Canô',
    licensePlate: 'SG-003',
    capacity: 8,
    status: 2,
  ),
];

/// Provider for mock missions list.
final missionsProvider = StateProvider<List<RescueMissionModel>>(
  (ref) => mockMissions,
);

/// Provider for mock vehicles list.
final vehiclesProvider = StateProvider<List<VehicleModel>>(
  (ref) => mockVehicles,
);
