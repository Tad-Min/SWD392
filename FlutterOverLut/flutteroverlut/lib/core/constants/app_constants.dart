// Role and API constants for the OverLut app.

/// User roles matching the backend roleId values.
enum AppRole {
  citizen(1, 'Citizen', 'Người dân'),
  rescueTeam(2, 'Rescue Team', 'Đội cứu hộ'),
  coordinator(3, 'Coordinator', 'Điều phối viên'),
  manager(4, 'Manager', 'Quản lý'),
  admin(5, 'Admin', 'Quản trị');

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

/// Mission status values.
enum MissionStatus {
  pending(0, 'Chờ xử lý'),
  inProgress(1, 'Đang thực hiện'),
  completed(2, 'Hoàn thành'),
  cancelled(3, 'Hủy bỏ');

  const MissionStatus(this.id, this.label);
  final int id;
  final String label;

  static MissionStatus fromId(int id) {
    return MissionStatus.values.firstWhere(
      (s) => s.id == id,
      orElse: () => MissionStatus.pending,
    );
  }
}

/// Request urgency levels.
enum RequestUrgency {
  needSupport(1, 'Cần hỗ trợ'),
  dangerous(2, 'Nguy hiểm'),
  critical(3, 'Khẩn cấp'),
  sos(4, 'SOS');

  const RequestUrgency(this.id, this.label);
  final int id;
  final String label;

  static RequestUrgency fromId(int id) {
    return RequestUrgency.values.firstWhere(
      (u) => u.id == id,
      orElse: () => RequestUrgency.needSupport,
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
