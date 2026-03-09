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
  low(1, 'Thấp'),
  medium(2, 'Trung bình'),
  high(3, 'Cao'),
  critical(4, 'Khẩn cấp');

  const RequestUrgency(this.id, this.label);
  final int id;
  final String label;

  static RequestUrgency fromId(int id) {
    return RequestUrgency.values.firstWhere(
      (u) => u.id == id,
      orElse: () => RequestUrgency.low,
    );
  }
}

/// API endpoint paths (relative to base URL).
class ApiEndpoints {
  ApiEndpoints._();

  // Auth
  static const String login = 'Auth/Login';
  static const String register = 'Auth/Register';
  static const String logout = 'Auth/Logout';
  static const String refreshToken = 'Auth/RefreshToken';

  // Users
  static const String users = 'User';
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

  // Rescue Teams
  static const String rescueTeams = 'RescueTeam/GetAll';
  static const String rescueTeamById = 'RescueTeam/GetById'; // + /{id}

  // Vehicles
  static const String vehicles = 'Vehicle';
  static const String vehicleAssign = 'Vehicle/Assign';

  // Products & Inventory
  static const String products = 'Product';
  static const String categories = 'Category';
  static const String warehouses = 'WareHouse';
  static const String warehouseStock = 'WareHouse/Stock';

  // Transactions
  static const String transactions = 'Transaction';
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
