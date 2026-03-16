/// Models for rescue team features, matching the backend API schemas.

class RescueMissionModel {
  final int? missionId;
  final int? rescueRequestId;
  final int? coordinatorUserId;
  final int? teamId;
  final int? statusId;
  final String? assignedAt;
  final String? description;

  const RescueMissionModel({
    this.missionId,
    this.rescueRequestId,
    this.coordinatorUserId,
    this.teamId,
    this.statusId,
    this.assignedAt,
    this.description,
  });

  factory RescueMissionModel.fromJson(Map<String, dynamic> json) {
    return RescueMissionModel(
      missionId: json['missionId'] as int?,
      rescueRequestId: json['rescueRequestId'] as int?,
      coordinatorUserId: json['coordinatorUserId'] as int?,
      teamId: json['teamId'] as int?,
      statusId: json['statusId'] as int?,
      assignedAt: json['assignedAt'] as String?,
      description: json['description'] as String?,
    );
  }

  /// Legacy getters for backward compat.
  int? get id => missionId;
  int? get status => statusId;
  String? get missionName => description != null && description!.length > 40
      ? '${description!.substring(0, 40)}...'
      : description;

  /// Human-readable status label.
  String get statusLabel {
    switch (statusId) {
      case 0:
        return 'Chờ phân công';
      case 1:
        return 'Đang thực hiện';
      case 2:
        return 'Hoàn thành';
      case 3:
        return 'Đã hủy';
      default:
        return 'Không rõ';
    }
  }

  /// Formatted date.
  String get formattedDate {
    if (assignedAt == null) return '';
    final dt = DateTime.tryParse(assignedAt!);
    if (dt == null) return '';
    return '${dt.day}/${dt.month}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  /// Time ago string.
  String get timeAgo {
    if (assignedAt == null) return '';
    final dt = DateTime.tryParse(assignedAt!);
    if (dt == null) return '';
    final diff = DateTime.now().difference(dt);
    if (diff.inDays > 0) return '${diff.inDays} ngày trước';
    if (diff.inHours > 0) return '${diff.inHours} giờ trước';
    if (diff.inMinutes > 0) return '${diff.inMinutes} phút trước';
    return 'Vừa xong';
  }
}

class VehicleModel {
  final int? vehicleId;
  final String? vehicleCode;
  final int? vehicleType;
  final int? capacity;
  final int? statusId;

  const VehicleModel({
    this.vehicleId,
    this.vehicleCode,
    this.vehicleType,
    this.capacity,
    this.statusId,
  });

  factory VehicleModel.fromJson(Map<String, dynamic> json) {
    return VehicleModel(
      vehicleId: json['vehicleId'] as int?,
      vehicleCode: json['vehicleCode'] as String?,
      vehicleType: json['vehicleType'] as int?,
      capacity: json['capacity'] as int?,
      statusId: json['statusId'] as int?,
    );
  }

  /// Legacy getters for backward compat with UI.
  int? get id => vehicleId;
  String? get vehicleName => vehicleCode;
  String? get licensePlate => vehicleCode;
  int? get status => statusId;

  /// Human-readable status label.
  String get statusLabel {
    switch (statusId) {
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

  /// Vehicle type display name.
  String get vehicleTypeName {
    switch (vehicleType) {
      case 1:
        return 'Canô';
      case 2:
        return 'Xe tải';
      case 3:
        return 'Xuồng';
      default:
        return 'Phương tiện #$vehicleType';
    }
  }
}

/// A single member inside a rescue team.
class TeamMemberModel {
  final int? userId;
  final int? teamId;
  final int? roleId;
  final String? fullName;
  final String? email;
  final String? phone;

  const TeamMemberModel({
    this.userId,
    this.teamId,
    this.roleId,
    this.fullName,
    this.email,
    this.phone,
  });

  factory TeamMemberModel.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>?;
    return TeamMemberModel(
      userId: json['userId'] as int?,
      teamId: json['teamId'] as int?,
      roleId: json['roleId'] as int? ?? user?['roleId'] as int?,
      fullName: user?['fullName'] as String?,
      email: user?['email'] as String?,
      phone: user?['phone'] as String?,
    );
  }

  String get memberRoleName {
    switch (roleId) {
      case 1:
        return 'Đội trưởng';
      case 2:
        return 'Đội viên';
      case 3:
        return 'Hỗ trợ';
      default:
        return 'Thành viên';
    }
  }
}

/// A rescue team with members list.
class RescueTeamModel {
  final int? teamId;
  final String? teamName;
  final int? statusId;
  final bool? isActive;
  final String? createdAt;
  final List<TeamMemberModel> members;

  const RescueTeamModel({
    this.teamId,
    this.teamName,
    this.statusId,
    this.isActive,
    this.createdAt,
    this.members = const [],
  });

  factory RescueTeamModel.fromJson(Map<String, dynamic> json) {
    final rawMembers =
        json['rescueTeamMembers'] as List<dynamic>? ?? [];
    return RescueTeamModel(
      teamId: json['teamId'] as int?,
      teamName: json['teamName'] as String?,
      statusId: json['statusId'] as int?,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] as String?,
      members: rawMembers
          .map((e) => TeamMemberModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

