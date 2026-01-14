USE master
GO

DROP DATABASE IF EXISTS OverLut
GO
DROP DATABASE IF EXISTS OverLut_Storage
GO

CREATE DATABASE OverLut
GO
CREATE DATABASE OverLut_Storage
GO

USE OverLut
----------------------------
-- 1) Roles + Users
----------------------------

CREATE TABLE Roles(
RoleID INT NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
RoleName NVARCHAR(255) NOT NULL CONSTRAINT UQ_Roles_RoleName UNIQUE
);
GO
-- Citizen=1, RescueTeam=2, Coordinator=3, Manager=4, Admin=5
-- INSERT Roles(RoleID, RoleName) VALUES (1,N'Citizen'),(2,N'RescueTeam'),(3,N'RescueCoordinator'),(4,N'Manager'),(5,N'Admin');

CREATE TABLE Users (
	UserID INT IDENTITY(1,1) CONSTRAINT PK_Users PRIMARY KEY,
	RoleID INT NOT NULL,
	FullName NVARCHAR(150) NULL,
	IdentifyID VARCHAR(13) NULL,
	[Address] NVARCHAR(500) NULL,
	Email NVARCHAR(200) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
	Phone VARCHAR(12) NULL,
	[Password] NVARCHAR(100) NULL,
	LastPwdChange DATETIME NOT NULL DEFAULT GETDATE(),
	IsActive BIT NOT NULL DEFAULT 1,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

----------------------------
-- 2) Yêu cầu cứu hộ/cứu trợ
----------------------------
CREATE TABLE RescueRequestsStatus(
	RescueRequestsStatusID INT NOT NULL CONSTRAINT  PK_RescueRequestsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueRequestsStatus_StatusName UNIQUE,
);
GO
-- 0: New, 1: Verified, 2: Assigned, 3: InProgress, 4: Done, 5: Rejected
-- INSERT RescueRequestsStatus(RescueRequestsStatusID, StatusName) VALUES (0,N'New'),(1,N'Verified'),(2,N'Assigned'),(3,N'InProgress'),(4,N'Done'),(5,N'Rejected');

CREATE TABLE RescueRequestsTypes(
	RescueRequestsTypeID INT NOT NULL CONSTRAINT  PK_RescueRequestsTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueRequestsTypes_TypeName UNIQUE , 
);
GO
-- 0: Rescue, 1: Relief, 2: Both
-- INSERT RescueRequestsTypes(RescueRequestsTypeID, TypeName) VALUES (0,N'Rescue'),(1,N'Relief'),(2,N'Both');

CREATE TABLE RescueRequests(
  RescueRequestID UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_RescueRequests PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  CitizenUserID INT NOT NULL CONSTRAINT FK_RescueRequests_Citizen REFERENCES Users(UserID),
  RequestType INT NOT NULL CONSTRAINT FK_RescueRequests_RescueRequestsTypes REFERENCES RescueRequestsTypes(RescueRequestsTypeID),
  UrgencyLevel INT NOT NULL CHECK (UrgencyLevel>=1 and UrgencyLevel<=5),       -- 1..5
  [Status] INT NOT NULL CONSTRAINT FK_RescueRequests_RescueRequestsStatus REFERENCES RescueRequestsStatus(RescueRequestsStatusID),
  [Description] NVARCHAR(2000) NULL,
  PeopleCount INT NULL,
  PhoneContact VARCHAR(12) NULL,

  -- Vị trí: dùng geography để làm map/nearby queries [web:2][web:3]
  [Location] GEOGRAPHY NULL,
  LocationText NVARCHAR(500) NULL, -- địa chỉ mô tả

  VerifiedByUserID INT NULL CONSTRAINT FK_RescueRequests_VerifiedBy REFERENCES Users(UserID),
  VerifiedAt DATETIME2 NULL,

  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

CREATE TABLE RescueRequestStatusHistory(
  HistoryID BIGINT IDENTITY(1,1) CONSTRAINT PK_RescueRequestStatusHistory PRIMARY KEY,
  RescueRequestID UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_ReqStatusHistory_RescueRequests REFERENCES RescueRequests(RescueRequestID) ON DELETE CASCADE,
  OldStatus INT NULL,
  NewStatus INT NOT NULL,
  Note NVARCHAR(1000) NULL,
  ChangedByUserID INT NOT NULL CONSTRAINT FK_ReqStatusHistory_Users REFERENCES Users(UserID),
  ChangedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

-- Ảnh/file đính kèm: lưu metadata + FileBlobID
CREATE TABLE RescueRequestAttachments(
  AttachmentID UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_RescueRequestAttachments PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  RescueRequestID UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_ReqAttach_RescueRequests REFERENCES RescueRequests(RescueRequestID) ON DELETE CASCADE,
  [FileName] NVARCHAR(255) NOT NULL,
  ContentType NVARCHAR(100) NOT NULL,
  FileSize BIGINT NOT NULL,
  FileBlobID UNIQUEIDENTIFIER NOT NULL,
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

----------------------------
-- 3) Đội cứu hộ, nhiệm vụ, phương tiện
----------------------------

CREATE TABLE RescueTeamsStatus(
	RescueTeamsStatusID INT NOT NULL CONSTRAINT PK_RescueTeamsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueTeamsStatus_StatusName UNIQUE
);
GO
-- 0: Available, 1: Busy, 2: Offline
-- INSERT RescueTeamsStatus(RescueTeamsStatusID, StatusName) VALUES (0,N'Available'),(1,N'Busy'),(2,N'Offline');

CREATE TABLE RescueTeams(
  TeamID INT IDENTITY(1,1) CONSTRAINT PK_RescueTeams PRIMARY KEY,
  TeamName NVARCHAR(200) NOT NULL,
  StatusID INT NOT NULL DEFAULT 0 CONSTRAINT FK_RescueTeams_RescueTeamsStatus REFERENCES RescueTeamsStatus(RescueTeamsStatusID), 
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE RescueMembersRolls(
	RescueMembersRollID INT NOT NULL CONSTRAINT PK_RescueMembersRolls PRIMARY KEY,
	RollName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueMembersRolls_RollName UNIQUE
);
GO
-- 0: Leader, 1: Member
-- INSERT RescueMembersRolls(RescueMembersRollID, RollName) VALUES (0,N'Leader'),(1,N'Member');


CREATE TABLE RescueTeamMembers(
  TeamID INT NOT NULL CONSTRAINT FK_TeamMembers_Team REFERENCES RescueTeams(TeamID) ON DELETE CASCADE,
  UserID INT NOT NULL CONSTRAINT FK_TeamMembers_User REFERENCES Users(UserID) ON DELETE CASCADE,
  RoleID INT NOT NULL DEFAULT 0 CONSTRAINT FK_RescueTeamMembers_RescueMembersRolls REFERENCES RescueMembersRolls(RescueMembersRollID),
  CONSTRAINT PK_RescueTeamMembers PRIMARY KEY (TeamID, UserID),
);
GO

CREATE TABLE VehiclesTypes(
	VehicleTypeID INT NOT NULL CONSTRAINT PK_VehiclesTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL CONSTRAINT UQ_VehiclesTypes_TypeName UNIQUE
);
GO
-- 0: boat, 1: truck, 2: ambulance
-- INSERT VehiclesTypes(VehicleTypeID, TypeName) VALUES (0,N'Boat'),(1,N'Truck'),(2,N'Ambulance');

CREATE TABLE VehiclesStatus(
	VehiclesStatusID INT NOT NULL CONSTRAINT PK_VehiclesStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_VehiclesStatus_StatusName UNIQUE
);
GO
 -- 0: Available, 1: InUse, 2: Maintenance
-- INSERT VehiclesStatus(VehiclesStatusID, StatusName) VALUES (0,N'Available'),(1,N'InUse'),(2,N'Maintenance');

CREATE TABLE Vehicles(
  VehicleID INT IDENTITY(1,1) CONSTRAINT PK_Vehicles PRIMARY KEY,
  VehicleCode NVARCHAR(50) NOT NULL CONSTRAINT UQ_Vehicles_VehicleCode UNIQUE,
  VehicleType INT NOT NULL CONSTRAINT FK_Vehicles_VehiclesTypes REFERENCES VehiclesTypes(VehicleTypeID),
  Capacity INT NULL,
  StatusID INT NOT NULL CONSTRAINT FK_Vehicles_VehiclesStatus REFERENCES VehiclesStatus(VehiclesStatusID),
  Note NVARCHAR(500) NULL
);
GO

CREATE TABLE RescueMissionsStatus(
	RescueMissionsStatusID INT NOT NULL CONSTRAINT PK_RescueMissionsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueMissionsStatus_StatusName UNIQUE
);
GO
-- 0 Assigned, 1 EnRoute, 2 Rescuing, 3 Completed, 4 Failed
-- INSERT RescueMissionsStatus(VehiclesStatusID, StatusName) VALUES (0,N'Assigned'),(1,N'EnRoute'),(2,N'Rescuing'),(3,N'Completed'),(4,N'Failed');

CREATE TABLE RescueMissions(
  MissionID UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_RescueMissions PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  RescueRequestID UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_RescueMissions_RescueRequests REFERENCES RescueRequests(RescueRequestID),
  CoordinatorUserID INT NOT NULL  CONSTRAINT FK_Missions_Coordinator REFERENCES Users(UserID),
  TeamID INT NOT NULL CONSTRAINT FK_Missions_Team REFERENCES RescueTeams(TeamID),
  StatusID INT NOT NULL CONSTRAINT FK_RescueMissions_RescueMissionsStatus REFERENCES RescueMissionsStatus(RescueMissionsStatusID),
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CompletedAt DATETIME2 NULL,
  ResultSummary NVARCHAR(2000) NULL,
);
GO

CREATE TABLE VehicleAssignments(
  MissionID UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_VehicleAssignments_Mission REFERENCES RescueMissions(MissionID) ON DELETE CASCADE,
  VehicleID INT NOT NULL CONSTRAINT FK_VehicleAssignments_Vehicle REFERENCES Vehicles(VehicleID),
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  ReleasedAt DATETIME2 NULL,
  CONSTRAINT PK_VehicleAssignments PRIMARY KEY (MissionID, VehicleID),
);
GO

CREATE TABLE MissionUpdates(
  UpdateID BIGINT IDENTITY(1,1) CONSTRAINT PK_MissionUpdates PRIMARY KEY,
  MissionID UNIQUEIDENTIFIER NOT NULL CONSTRAINT FK_MissionUpdates_Mission REFERENCES RescueMissions(MissionID) ON DELETE CASCADE,
  UpdatedByUserID INT NOT NULL CONSTRAINT FK_MissionUpdates_User REFERENCES Users(UserID),
  NewStatus INT NULL,
  Note NVARCHAR(2000) NULL,
  UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

----------------------------
-- 4) Kho & phân phối cứu trợ
----------------------------
CREATE TABLE Warehouses(
  WarehouseID INT IDENTITY(1,1) CONSTRAINT PK_Warehouses PRIMARY KEY,
  WarehouseName NVARCHAR(200) NOT NULL,
  LocationText NVARCHAR(500) NULL
);
GO

CREATE TABLE ReliefItems(
  ReliefItemID INT IDENTITY(1,1) CONSTRAINT PK_ReliefItems PRIMARY KEY,
  ItemName NVARCHAR(200) NOT NULL,
  Unit NVARCHAR(50) NOT NULL  -- thùng/chai/gói...
);
GO

CREATE TABLE InventoryTransactions(
  TxID BIGINT IDENTITY(1,1) CONSTRAINT PK_InventoryTransactions PRIMARY KEY,
  WarehouseID INT NOT NULL CONSTRAINT FK_InventoryTx_Warehouse  REFERENCES Warehouses(WarehouseID),
  ReliefItemID INT NOT NULL CONSTRAINT FK_InventoryTx_ReliefItems REFERENCES ReliefItems(ReliefItemID),
  TxType INT NOT NULL,        -- 0: In, 1: Out, 2: Adjust
  Quantity DECIMAL(18,2) NOT NULL,
  RescueRequestID UNIQUEIDENTIFIER NULL CONSTRAINT FK_InventoryTransactions_RescueRequests REFERENCES RescueRequests(RescueRequestID),
  Note NVARCHAR(1000) NULL,
  CreatedByUserID INT NOT NULL CONSTRAINT FK_InventoryTx_CreatedByUser REFERENCES Users(UserID),
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

----------------------------
-- 5) Thông báo
----------------------------
CREATE TABLE Notifications(
  NotificationID BIGINT IDENTITY(1,1) CONSTRAINT PK_Notifications PRIMARY KEY,
  UserID INT NOT NULL,
  RescueRequestID UNIQUEIDENTIFIER NULL CONSTRAINT FK_Notifications_RescueRequests REFERENCES RescueRequests(RescueRequestID),
  Title NVARCHAR(200) NOT NULL,
  Body NVARCHAR(2000) NOT NULL,
  IsRead BIT NOT NULL DEFAULT 0,
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Notifications_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
);
GO


