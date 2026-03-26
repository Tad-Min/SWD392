/// Models for the Volunteer feature, matching backend VolunteerController API.

// ─── Volunteer Profile ──────────────────────────────────────────────────────

class VolunteerProfileModel {
  final int? volunteerProfileId;
  final int? userId;
  final int? applicationStatus; // 0=Pending, 1=Approved, 2=Rejected, 3=Suspended
  final bool? isAvailable;
  final String? notes;
  final String? volunteerProvince;
  final String? volunteerWard;
  final String? createdAt;
  final String? approvedAt;
  final String? rejectedReason;

  const VolunteerProfileModel({
    this.volunteerProfileId,
    this.userId,
    this.applicationStatus,
    this.isAvailable,
    this.notes,
    this.volunteerProvince,
    this.volunteerWard,
    this.createdAt,
    this.approvedAt,
    this.rejectedReason,
  });

  factory VolunteerProfileModel.fromJson(Map<String, dynamic> json) =>
      VolunteerProfileModel(
        volunteerProfileId: json['volunteerProfileId'] as int?,
        userId: json['userId'] as int?,
        applicationStatus: json['applicationStatus'] as int?,
        isAvailable: json['isAvailable'] as bool?,
        notes: json['notes'] as String?,
        volunteerProvince: json['volunteerProvince'] as String?,
        volunteerWard: json['volunteerWard'] as String?,
        createdAt: json['createdAt'] as String?,
        approvedAt: json['approvedAt'] as String?,
        rejectedReason: json['rejectedReason'] as String?,
      );

  /// Human-readable status.
  String get statusLabel {
    switch (applicationStatus) {
      case 0:
        return 'Chờ phê duyệt';
      case 1:
        return 'Đã phê duyệt';
      case 2:
        return 'Bị từ chối';
      case 3:
        return 'Bị đình chỉ';
      default:
        return 'Không rõ';
    }
  }

  bool get isPending => applicationStatus == 0;
  bool get isApproved => applicationStatus == 1;
  bool get isRejectedOrSuspended =>
      applicationStatus == 2 || applicationStatus == 3;
}

// ─── Skill Types ────────────────────────────────────────────────────────────

class VolunteerSkillTypeModel {
  final int? skillTypeId;
  final String? skillName;

  const VolunteerSkillTypeModel({this.skillTypeId, this.skillName});

  factory VolunteerSkillTypeModel.fromJson(Map<String, dynamic> json) =>
      VolunteerSkillTypeModel(
        skillTypeId: json['skillTypeId'] as int?,
        skillName: json['skillName'] as String?,
      );

  /// Localised display name for the skill.
  String get displayName {
    switch (skillTypeId) {
      case 1:
        return 'Hỗ trợ y tế';
      case 2:
        return 'Cứu hộ trực tiếp';
      case 3:
        return 'Hậu cần';
      case 4:
        return 'Lái xuồng';
      default:
        return skillName ?? 'Kỹ năng $skillTypeId';
    }
  }
}

class VolunteerSkillModel {
  final int? volunteerSkillId;
  final int? skillTypeId;
  final String? skillName;

  const VolunteerSkillModel({
    this.volunteerSkillId,
    this.skillTypeId,
    this.skillName,
  });

  factory VolunteerSkillModel.fromJson(Map<String, dynamic> json) =>
      VolunteerSkillModel(
        volunteerSkillId: json['volunteerSkillId'] as int?,
        skillTypeId: json['skillTypeId'] as int?,
        skillName: json['skillName'] as String?,
      );
}

// ─── Offer Types ────────────────────────────────────────────────────────────

class VolunteerOfferTypeModel {
  final int? offerTypeId;
  final String? typeName;
  final bool? isTypicallyReturnable;

  const VolunteerOfferTypeModel({
    this.offerTypeId,
    this.typeName,
    this.isTypicallyReturnable,
  });

  factory VolunteerOfferTypeModel.fromJson(Map<String, dynamic> json) =>
      VolunteerOfferTypeModel(
        offerTypeId: json['offerTypeId'] as int?,
        typeName: json['typeName'] as String?,
        isTypicallyReturnable: json['isTypicallyReturnable'] as bool?,
      );

  String get displayName {
    switch (offerTypeId) {
      case 1:
        return 'Thực phẩm';
      case 2:
        return 'Áo phao';
      case 3:
        return 'Thuyền / Xuồng';
      case 4:
        return 'Vật tư y tế';
      case 5:
        return 'Thiết bị cứu hộ';
      case 6:
        return 'Khác';
      default:
        return typeName ?? 'Loại $offerTypeId';
    }
  }
}

// ─── Offers ─────────────────────────────────────────────────────────────────

class VolunteerOfferModel {
  final int? offerId;
  final int? offerTypeId;
  final String? offerName;
  final double? quantity;
  final String? unit;
  final String? description;
  final bool? isReturnRequired;
  final int? currentStatus;
  final String? dropoffLocationText;
  final String? contactPhone;
  final String? createdAt;

  const VolunteerOfferModel({
    this.offerId,
    this.offerTypeId,
    this.offerName,
    this.quantity,
    this.unit,
    this.description,
    this.isReturnRequired,
    this.currentStatus,
    this.dropoffLocationText,
    this.contactPhone,
    this.createdAt,
  });

  factory VolunteerOfferModel.fromJson(Map<String, dynamic> json) =>
      VolunteerOfferModel(
        offerId: json['offerId'] as int?,
        offerTypeId: json['offerTypeId'] as int?,
        offerName: json['offerName'] as String?,
        quantity: (json['quantity'] as num?)?.toDouble(),
        unit: json['unit'] as String?,
        description: json['description'] as String?,
        isReturnRequired: json['isReturnRequired'] as bool?,
        currentStatus: json['currentStatus'] as int?,
        dropoffLocationText: json['dropoffLocationText'] as String?,
        contactPhone: json['contactPhone'] as String?,
        createdAt: json['createdAt'] as String?,
      );

  String get statusLabel {
    switch (currentStatus) {
      case 0:
        return 'Chờ tiếp nhận';
      case 1:
        return 'Đã tiếp nhận';
      case 2:
        return 'Đã hoàn trả';
      default:
        return 'Không rõ';
    }
  }
}
