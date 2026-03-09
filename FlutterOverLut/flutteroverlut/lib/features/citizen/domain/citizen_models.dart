import '../../../core/constants/app_constants.dart';

/// Model for a rescue request.
class RescueRequestModel {
  final int? id;
  final String? description;
  final String? location;
  final double? latitude;
  final double? longitude;
  final int? urgencyLevel;
  final int? status;
  final int? numberOfPeople;
  final String? contactPhone;
  final String? createdAt;
  final String? updatedAt;
  final int? userId;

  const RescueRequestModel({
    this.id,
    this.description,
    this.location,
    this.latitude,
    this.longitude,
    this.urgencyLevel,
    this.status,
    this.numberOfPeople,
    this.contactPhone,
    this.createdAt,
    this.updatedAt,
    this.userId,
  });

  factory RescueRequestModel.fromJson(Map<String, dynamic> json) {
    return RescueRequestModel(
      id: json['rescueRequestId'] ?? json['id'],
      description: json['description'] as String?,
      location: json['location'] as String?,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      urgencyLevel: json['urgencyLevel'] as int?,
      status: json['status'] ?? json['requestStatus'],
      numberOfPeople: json['numberOfPeople'] as int?,
      contactPhone: json['contactPhone'] as String?,
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
      userId: json['userId'] as int?,
    );
  }

  Map<String, dynamic> toCreateJson() {
    return {
      'description': description,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'urgencyLevel': urgencyLevel,
      'numberOfPeople': numberOfPeople,
      'contactPhone': contactPhone,
    };
  }

  String get urgencyLabel => RequestUrgency.fromId(urgencyLevel ?? 1).label;
  String get statusLabel {
    switch (status) {
      case 0:
        return 'Chờ xử lý';
      case 1:
        return 'Đang xử lý';
      case 2:
        return 'Hoàn thành';
      case 3:
        return 'Hủy bỏ';
      default:
        return 'Không rõ';
    }
  }

  String get timeAgo {
    if (createdAt == null) return '';
    try {
      final date = DateTime.parse(createdAt!);
      final diff = DateTime.now().difference(date);
      if (diff.inMinutes < 60) return '${diff.inMinutes} phút trước';
      if (diff.inHours < 24) return '${diff.inHours} giờ trước';
      if (diff.inDays < 7) return '${diff.inDays} ngày trước';
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return createdAt ?? '';
    }
  }
}

/// Model for a user profile.
class UserProfileModel {
  final int? userId;
  final String? fullName;
  final String? email;
  final String? phone;
  final int? roleId;
  final bool? isActive;
  final String? address;

  const UserProfileModel({
    this.userId,
    this.fullName,
    this.email,
    this.phone,
    this.roleId,
    this.isActive,
    this.address,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      userId: json['userId'] as int?,
      fullName: json['fullName'] ?? json['userName'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      roleId: json['roleId'] as int?,
      isActive: json['isActive'] as bool?,
      address: json['address'] as String?,
    );
  }

  String get initials {
    if (fullName == null || fullName!.isEmpty) return 'U';
    final parts = fullName!.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    }
    return fullName![0].toUpperCase();
  }

  String get roleName => AppRole.fromId(roleId ?? 1).nameVi;
}
