import '../../../core/constants/app_constants.dart';

/// Model for a rescue mission.
class RescueMissionModel {
  final int? id;
  final String? missionName;
  final String? description;
  final String? location;
  final int? status;
  final int? teamId;
  final String? teamName;
  final int? requestId;
  final int? numberOfPeople;
  final String? startTime;
  final String? endTime;
  final String? createdAt;
  final List<VehicleModel> vehicles;

  const RescueMissionModel({
    this.id,
    this.missionName,
    this.description,
    this.location,
    this.status,
    this.teamId,
    this.teamName,
    this.requestId,
    this.numberOfPeople,
    this.startTime,
    this.endTime,
    this.createdAt,
    this.vehicles = const [],
  });

  factory RescueMissionModel.fromJson(Map<String, dynamic> json) {
    return RescueMissionModel(
      id: json['rescueMissionId'] ?? json['id'],
      missionName: json['missionName'] as String?,
      description: json['description'] as String?,
      location: json['location'] as String?,
      status: json['status'] as int?,
      teamId: json['teamId'] as int?,
      teamName: json['teamName'] as String?,
      requestId: json['requestId'] as int?,
      numberOfPeople: json['numberOfPeople'] as int?,
      startTime: json['startTime'] as String?,
      endTime: json['endTime'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }

  MissionStatus get missionStatus => MissionStatus.fromId(status ?? 0);
  String get statusLabel => missionStatus.label;

  String get formattedDate {
    if (createdAt == null) return '';
    try {
      final date = DateTime.parse(createdAt!);
      return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return createdAt ?? '';
    }
  }
}

/// Model for a vehicle.
class VehicleModel {
  final int? id;
  final String? vehicleName;
  final String? vehicleType;
  final String? licensePlate;
  final int? capacity;
  final int? status;

  const VehicleModel({
    this.id,
    this.vehicleName,
    this.vehicleType,
    this.licensePlate,
    this.capacity,
    this.status,
  });

  factory VehicleModel.fromJson(Map<String, dynamic> json) {
    return VehicleModel(
      id: json['vehicleId'] ?? json['id'],
      vehicleName: json['vehicleName'] as String?,
      vehicleType: json['vehicleType'] as String?,
      licensePlate: json['licensePlate'] as String?,
      capacity: json['capacity'] as int?,
      status: json['status'] as int?,
    );
  }

  String get statusLabel {
    switch (status) {
      case 0:
        return 'Sẵn sàng';
      case 1:
        return 'Đang sử dụng';
      case 2:
        return 'Bảo trì';
      default:
        return 'Không rõ';
    }
  }
}
