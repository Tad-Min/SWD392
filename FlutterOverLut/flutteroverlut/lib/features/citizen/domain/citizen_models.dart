/// Models for citizen-related features, matching the backend API schemas.

class RescueRequestModel {
  final int? rescueRequestId;
  final int? userReqId;
  final int? requestType;
  final int? urgencyLevel;
  final int? status;
  final String? description;
  final int? peopleCount;
  final Map<String, dynamic>? location; // GeoJSON Point
  final String? locationText;
  final String? createdAt;

  const RescueRequestModel({
    this.rescueRequestId,
    this.userReqId,
    this.requestType,
    this.urgencyLevel,
    this.status,
    this.description,
    this.peopleCount,
    this.location,
    this.locationText,
    this.createdAt,
  });

  /// Parse from API JSON response.
  factory RescueRequestModel.fromJson(Map<String, dynamic> json) {
    return RescueRequestModel(
      rescueRequestId: json['rescueRequestId'] as int?,
      userReqId: json['userReqId'] as int?,
      requestType: json['requestType'] as int?,
      urgencyLevel: json['urgencyLevel'] as int?,
      status: json['status'] as int?,
      description: json['description'] as String?,
      peopleCount: json['peopleCount'] as int?,
      location: json['location'] as Map<String, dynamic>?,
      locationText: json['locationText'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }

  /// Legacy getter for backward compatibility with ID references.
  int? get id => rescueRequestId;

  /// Build JSON for CreateRescueRequestModel (POST /api/RescueRequest/Add).
  Map<String, dynamic> toCreateJson({double? latitude, double? longitude}) {
    return {
      'description': description ?? '',
      'requestType': requestType ?? 1,
      'urgencyLevel': urgencyLevel ?? 1,
      'peopleCount': peopleCount ?? 1,
      'currentlocation': {
        'type': 'Point',
        'coordinates': [longitude ?? 0.0, latitude ?? 0.0],
      },
      'locationText': locationText ?? '',
    };
  }

  /// Human-readable urgency label.
  String get urgencyLabel {
    switch (urgencyLevel) {
      case 1:
        return 'Cần hỗ trợ';
      case 2:
        return 'Nguy hiểm';
      case 3:
        return 'Khẩn cấp';
      case 4:
        return 'SOS';
      default:
        return 'Chưa đánh giá';
    }
  }

  /// Human-readable status label.
  String get statusLabel {
    switch (status) {
      case 0:
        return 'Chờ duyệt';
      case 1:
        return 'Đang xử lý';
      case 2:
        return 'Hoàn thành';
      case 3:
        return 'Đã hủy';
      default:
        return 'Không rõ';
    }
  }

  /// Time ago string.
  String get timeAgo {
    if (createdAt == null) return '';
    final dt = DateTime.tryParse(createdAt!);
    if (dt == null) return '';
    final diff = DateTime.now().difference(dt);
    if (diff.inDays > 0) return '${diff.inDays} ngày trước';
    if (diff.inHours > 0) return '${diff.inHours} giờ trước';
    if (diff.inMinutes > 0) return '${diff.inMinutes} phút trước';
    return 'Vừa xong';
  }

  /// Convenience: get numberOfPeople alias.
  int? get numberOfPeople => peopleCount;
}

/// User profile model matching backend User schema.
class UserProfileModel {
  final int userId;
  final int roleId;
  final String? fullName;
  final String? identifyId;
  final String? address;
  final String? email;
  final String? phone;

  const UserProfileModel({
    required this.userId,
    required this.roleId,
    this.fullName,
    this.identifyId,
    this.address,
    this.email,
    this.phone,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      userId: json['userId'] as int? ?? 0,
      roleId: json['roleId'] as int? ?? 1,
      fullName: json['fullName'] as String?,
      identifyId: json['identifyId'] as String?,
      address: json['address'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
    );
  }

  /// Backward-compatible getter.
  String get userName => fullName ?? 'Người dùng';
}
