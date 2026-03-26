// Role and API constants for the OverLut app.

/// User roles matching the backend roleId values.
enum AppRole {
  citizen(1, 'Citizen', 'Người dân'),
  rescueTeam(2, 'Rescue Team', 'Đội cứu hộ'),
  coordinator(3, 'RescueCoordinator', 'Điều phối viên'),
  manager(4, 'Manager', 'Quản lý'),
  admin(5, 'Admin', 'Quản trị'),
  volunteer(6, 'Volunteer', 'Tình nguyện viên');

  const AppRole(this.id, this.nameEn, this.nameVi);
  final int id;
  final String nameEn;
  final String nameVi;

  static AppRole fromId(int id) {
    return AppRole.values.firstWhere(
      (r) => r.id == id,
      orElse: () => AppRole.citizen,
    );
  }
}

/// Mission status values matching RescueMissionsStatus table.
/// DB: 1=Assigned, 2=EnRoute, 3=Rescuing, 4=Completed, 5=Failed
enum MissionStatus {
  assigned(1, 'Đã phân công'),
  enRoute(2, 'Đang di chuyển'),
  rescuing(3, 'Đang cứu hộ'),
  completed(4, 'Hoàn thành'),
  failed(5, 'Thất bại');

  const MissionStatus(this.id, this.label);
  final int id;
  final String label;

  static MissionStatus fromId(int id) {
    return MissionStatus.values.firstWhere(
      (s) => s.id == id,
      orElse: () => MissionStatus.assigned,
    );
  }
}

/// Request urgency levels matching UrgencyLevels table.
/// DB: 1=Normal, 2=High, 3=Critical
enum RequestUrgency {
  normal(1, 'Bình thường'),
  high(2, 'Cao'),
  critical(3, 'Nghiêm trọng');

  const RequestUrgency(this.id, this.label);
  final int id;
  final String label;

  static RequestUrgency fromId(int id) {
    return RequestUrgency.values.firstWhere(
      (u) => u.id == id,
      orElse: () => RequestUrgency.normal,
    );
  }
}

/// Rescue request status matching RescueRequestsStatus table.
/// DB: 1=New, 2=Verified, 3=Assigned, 4=EnRoute, 5=OnSite, 6=Resolved, 7=Cancelled, 8=DuplicateMerged
enum RescueRequestStatus {
  newRequest(1, 'Mới'),
  verified(2, 'Đã xác minh'),
  assigned(3, 'Đã phân công'),
  enRoute(4, 'Đang di chuyển'),
  onSite(5, 'Tại hiện trường'),
  resolved(6, 'Đã giải quyết'),
  cancelled(7, 'Đã hủy'),
  duplicateMerged(8, 'Trùng lặp');

  const RescueRequestStatus(this.id, this.label);
  final int id;
  final String label;

  static RescueRequestStatus fromId(int id) {
    return RescueRequestStatus.values.firstWhere(
      (s) => s.id == id,
      orElse: () => RescueRequestStatus.newRequest,
    );
  }
}

/// Rescue team status matching RescueTeamsStatus table.
/// DB: 1=Available, 2=Busy, 3=Offline
enum RescueTeamStatus {
  available(1, 'Sẵn sàng'),
  busy(2, 'Đang bận'),
  offline(3, 'Ngoại tuyến');

  const RescueTeamStatus(this.id, this.label);
  final int id;
  final String label;

  static RescueTeamStatus fromId(int id) {
    return RescueTeamStatus.values.firstWhere(
      (s) => s.id == id,
      orElse: () => RescueTeamStatus.available,
    );
  }
}

/// API endpoint paths (relative to base URL).
class ApiEndpoints {
  ApiEndpoints._();

  // Auth
  static const String login = 'Auth/login';
  static const String register = 'Auth/Register';
  static const String logout = 'Auth/Logout';
  static const String refreshToken = 'Auth/GetAccessToken';

  // Users
  static const String users = 'User';
  static const String userById = 'User'; // + /{id}
  static const String userRole = 'User/role';

  // Rescue Missions
  static const String rescueMissions = 'RescueMission/GetAll';
  static const String rescueMissionById = 'RescueMission/GetById'; // + /{id}
  static const String rescueMissionAdd = 'RescueMission/Add';
  static const String rescueMissionUpdate = 'RescueMission/Update';

  // Rescue Requests
  static const String rescueRequests = 'RescueRequest/GetAll';
  static const String rescueRequestById = 'RescueRequest/GetById'; // + /{id}
  static const String rescueRequestAdd = 'RescueRequest/Add';
  static const String rescueRequestUpdate = 'RescueRequest/Update';
  static const String rescueRequestUpdateLocation =
      'RescueRequest/UpdateLocation'; // + /{id}

  // Rescue Teams
  static const String rescueTeams = 'RescueTeam';
  static const String rescueTeamById = 'RescueTeam'; // + /{id}
  static const String rescueTeamByUserId = 'RescueTeam/GetRescueTeamByUserId'; // + /{userId}
  static const String rescueTeamMembersByTeamId = 'RescueTeam/GetRescueTeamMembersByTeamId'; // + /{teamId}

  // Vehicles — base is 'Vehicle', actual vehicle list is 'Vehicle/Vehicle'
  static const String vehicleAll = 'Vehicle/Vehicle'; // GET all vehicles
  static const String vehicleById = 'Vehicle/Vehicle'; // + /{id}
  static const String vehicleUpdate = 'Vehicle/Vehicle'; // PUT /{id}
  static const String vehicleAssign = 'Vehicle/AssignVehicle';
  static const String vehicleAssignByMission = 'Vehicle/AssignVehicle/MissionId'; // + /{missionId}
  static const String vehicleAssignRelease = 'Vehicle/AssignVehicle/Release'; // PUT /{vehicleId}

  // Status
  static const String statusVehicles = 'Status/Vehicles';
  static const String statusRescueRequests = 'Status/RescueRequests';
  static const String statusRescueMissions = 'Status/RescueMissions';
  static const String statusRescueTeams = 'Status/RescueTeams';

  // Products & Inventory
  static const String products = 'Product';
  static const String categories = 'Category';
  static const String warehouses = 'WareHouse';
  static const String warehouseStock = 'WareHouse/Stock';

  // Transactions
  static const String transactions = 'InventoryTransaction';
}

/// Secure storage keys.
class StorageKeys {
  StorageKeys._();

  static const String userId = 'userId';
  static const String roleId = 'roleId';
  static const String userName = 'userName';
  static const String token = 'token';
  static const String refreshTokenKey = 'refreshToken';
}
