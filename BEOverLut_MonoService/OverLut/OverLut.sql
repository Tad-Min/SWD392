USE master
GO
----DROP _db----
DROP DATABASE IF EXISTS OverlutDb
GO
DROP DATABASE IF EXISTS OverlutDb_Storage
GO


----CREATE _db----
CREATE DATABASE OverlutDb
GO
CREATE DATABASE OverlutDb_Storage
GO

---- OverlutDb ----
USE OverlutDb
GO

CREATE TABLE Roles(
RoleID INT NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
RoleName NVARCHAR(255) NOT NULL CONSTRAINT UQ_Roles_RoleName UNIQUE,
);
GO
-- Citizen=1, RescueTeam=2, Coordinator=3, Manager=4, Admin=5
INSERT Roles(RoleID, RoleName) VALUES (1,N'Citizen'),(2,N'RescueTeam'),(3,N'RescueCoordinator'),(4,N'Manager'),(5,N'Admin');


CREATE TABLE Users (
	UserID INT IDENTITY(1,1) CONSTRAINT PK_Users PRIMARY KEY,
	RoleID INT NOT NULL,
	FullName NVARCHAR(150) NULL,
	IdentifyID VARCHAR(13) NULL,
	[Address] NVARCHAR(500) NULL,
	Email NVARCHAR(200) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
	Phone VARCHAR(12) NULL,
	[Password] NVARCHAR(100) NULL,
	IsActive BIT NOT NULL DEFAULT 1,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);
CREATE TABLE RefreshToken (
	RefreshTokenId INT PRIMARY KEY IDENTITY(1,1),
	UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
	Token NVARCHAR(500) UNIQUE,
	CreatedAt DATETIME2 NOT NULL,
	ExpiredAt DATETIME2 NOT NULL,
	Revoked BIT NOT NULL DEFAULT 0,
	IPAddress NVARCHAR(255),
	UserAgent NVARCHAR(MAX)
);

CREATE TABLE RescueRequestsStatus(
	RescueRequestsStatusID INT IDENTITY(1,1) NOT NULL CONSTRAINT  PK_RescueRequestsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
-- 0: New, 1: Verified, 2: Assigned, 3: EnRoute, 4: OnSite, 5: Resolved, 6: Cancelled, 7: DuplicateMerged
INSERT RescueRequestsStatus(StatusName) VALUES (N'New'),(N'Verified'),(N'Assigned'),(N'EnRoute'),(N'OnSite'),(N'Resolved'),(N'Cancelled'),(N'DuplicateMerged');
CREATE TABLE RescueRequestsTypes(
	RescueRequestsTypeID INT IDENTITY(1,1) NOT NULL CONSTRAINT  PK_RescueRequestsTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL, 
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
-- 0: Rescue, 1: Relief, 2: Both
INSERT RescueRequestsTypes(TypeName) VALUES (N'Rescue'),(N'Relief'),(N'Both');
CREATE TABLE UrgencyLevels(
	UrgencyLevelID INT IDENTITY(1,1) NOT NULL CONSTRAINT  PK_UrgencyLevel PRIMARY KEY,
	UrgencyName NVARCHAR(100) NOT NULL,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
INSERT UrgencyLevels(UrgencyName) VALUES (N'Normal'),(N'High'),(N'Critical');

CREATE TABLE RescueRequests(
  RescueRequestID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_RescueRequests PRIMARY KEY,
  UserReqID INT NULL CONSTRAINT FK_RescueRequests_UserReqID REFERENCES Users(UserID),
  RequestType INT NOT NULL CONSTRAINT FK_RescueRequests_RescueRequestsTypes REFERENCES RescueRequestsTypes(RescueRequestsTypeID),
  UrgencyLevel INT NULL CONSTRAINT FK_RescueRequests_UrgencyLevels REFERENCES UrgencyLevels(UrgencyLevelID),
  IPAddress NVARCHAR(50) NULL,
  UserAgent NVARCHAR(MAX) NULL,

  [Status] INT NOT NULL CONSTRAINT FK_RescueRequests_RescueRequestsStatus REFERENCES RescueRequestsStatus(RescueRequestsStatusID),
  [Description] NVARCHAR(500) NULL,
  PeopleCount INT NULL DEFAULT 1,

  [Location] GEOGRAPHY NULL,
  LocationText NVARCHAR(500) NULL,

  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
);
GO

CREATE TABLE RescueRequestLogs(
  LogID BIGINT IDENTITY(1,1),
  RescueRequestID INT NOT NULL CONSTRAINT FK_ReqStatusHistory_RescueRequests REFERENCES RescueRequests(RescueRequestID) ON DELETE CASCADE,
  OldRescueRequests NVARCHAR(2000),
  ChangedByUserID INT NULL,
  ChangedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_RescueRequestLog PRIMARY KEY (LogID,RescueRequestID),
);
GO

-- Ảnh/file đính kèm: lưu metadata + FileBlobID
CREATE TABLE AttachmentRescue(
  AttachmentID UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_RescueRequestAttachments PRIMARY KEY,
  RescueRequestID INT NOT NULL CONSTRAINT FK_AttachmentRescue_RescueRequests REFERENCES RescueRequests(RescueRequestID) ON DELETE CASCADE,
  FileSize BIGINT NOT NULL,
  FileType NVARCHAR(50) NOT NULL,
);
GO

CREATE TABLE RescueMissionsStatus(
	RescueMissionsStatusID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_RescueMissionsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueMissionsStatus_StatusName UNIQUE,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO

-- 0 Assigned, 1 EnRoute, 2 Rescuing, 3 Completed, 4 Failed
INSERT RescueMissionsStatus(StatusName) VALUES (N'Assigned'),(N'EnRoute'),(N'Rescuing'),(N'Completed'),(N'Failed');

CREATE TABLE RescueMissions(
  MissionID INT NOT NULL IDENTITY(1,1) CONSTRAINT PK_RescueMissions PRIMARY KEY,
  RescueRequestID INT NOT NULL CONSTRAINT FK_RescueMissions_RescueRequests REFERENCES  RescueRequests(RescueRequestID),
  CoordinatorUserID INT NOT NULL  CONSTRAINT FK_RescueMissions_Users REFERENCES  Users(UserID),
  TeamID INT NOT NULL,
  StatusID INT NOT NULL CONSTRAINT FK_RescueMissions_RescueMissionsStatus REFERENCES RescueMissionsStatus(RescueMissionsStatusID),
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  [Description] NVARCHAR(500) NULL,
);
GO

CREATE TABLE MissionLogs(
  LogID BIGINT IDENTITY(1,1),
  MissionID INT NOT NULL CONSTRAINT FK_MissionLogs_RescueMissions REFERENCES RescueMissions(MissionID) ON DELETE CASCADE,
  OldRescueMissions NVARCHAR(2000),
  ChangedByUserID INT NOT NULL,
  ChangedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_MissionLogs PRIMARY KEY (LogID,MissionID),
);
GO

CREATE TABLE AttachmentMission(
  AttachmentID UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_AttachmentMission PRIMARY KEY,
  MissionID INT NOT NULL CONSTRAINT FK_AttachmentMission_RescueMissions REFERENCES RescueMissions(MissionID) ON DELETE CASCADE,
  FileSize BIGINT NOT NULL,
  FileType NVARCHAR(50) NOT NULL,
);
GO

CREATE TABLE VehiclesTypes(
	VehicleTypeID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_VehiclesTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
-- 0: boat, 1: truck, 2: ambulance
INSERT VehiclesTypes(TypeName) VALUES (N'Boat'),(N'Truck'),(N'Ambulance');

CREATE TABLE VehiclesStatus(
	VehiclesStatusID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_VehiclesStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
 -- 0: Available, 1: InUse, 2: Maintenance
INSERT VehiclesStatus(StatusName) VALUES (N'Available'),(N'InUse'),(N'Maintenance');

CREATE TABLE Vehicles(
  VehicleID INT IDENTITY(1,1) CONSTRAINT PK_Vehicles PRIMARY KEY,
  VehicleCode NVARCHAR(50) NOT NULL CONSTRAINT UQ_Vehicles_VehicleCode UNIQUE,
  VehicleType INT NOT NULL CONSTRAINT FK_Vehicles_VehiclesTypes REFERENCES VehiclesTypes(VehicleTypeID),
  Capacity INT NULL,
  StatusID INT NOT NULL CONSTRAINT FK_Vehicles_VehiclesStatus REFERENCES VehiclesStatus(VehiclesStatusID),
  Note NVARCHAR(500) NULL
);
GO

CREATE TABLE VehicleAssignments(
  MissionID INT NOT NULL CONSTRAINT FK_VehicleAssignments_RescueMissions REFERENCES RescueMissions(MissionID),
  VehicleID INT NOT NULL CONSTRAINT FK_VehicleAssignments_Vehicle REFERENCES Vehicles(VehicleID),
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  ReleasedAt DATETIME2 NULL,
  CONSTRAINT PK_VehicleAssignments PRIMARY KEY (MissionID, VehicleID),
);
GO

CREATE TABLE RescueTeamsStatus(
	RescueTeamsStatusID INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_RescueTeamsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL,
	IsDeleted BIT NOT NULL DEFAULT 0,
);
GO
-- 0: Available, 1: Busy, 2: Offline
INSERT RescueTeamsStatus(StatusName) VALUES (N'Available'),(N'Busy'),(N'Offline');

CREATE TABLE RescueTeams(
  TeamID INT IDENTITY(1,1) CONSTRAINT PK_RescueTeams PRIMARY KEY,
  TeamName NVARCHAR(200) NOT NULL,
  StatusID INT NOT NULL DEFAULT 0 CONSTRAINT FK_RescueTeams_RescueTeamsStatus REFERENCES RescueTeamsStatus(RescueTeamsStatusID), 
  CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  IsActive Bit NOT NULL Default 0
);
GO

CREATE TABLE RescueMembersRoles(
	RescueMembersRoleID INT NOT NULL CONSTRAINT PK_RescueMembersRoles PRIMARY KEY,
	RoleName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueMembersRoles_RollName UNIQUE
);
GO

-- 0: Leader, 1: Member
INSERT RescueMembersRoles(RescueMembersRoleID, RoleName) VALUES (0,N'Leader'),(1,N'Member');

CREATE TABLE RescueTeamMembers(
	UserID INT NOT NULL CONSTRAINT FK_RescueTeamMembers_Users REFERENCES Users(UserID),
	TeamID INT NOT NULL CONSTRAINT FK_TeamMembers_Team REFERENCES RescueTeams(TeamID) ON DELETE CASCADE,
	RoleID INT NOT NULL DEFAULT 0 CONSTRAINT FK_RescueTeamMembers_RescueMembersRoles REFERENCES RescueMembersRoles(RescueMembersRoleID),
	CONSTRAINT PK_RescueTeamMembers PRIMARY KEY (UserID),
);
GO

CREATE TABLE Warehouses(
	WarehouseID INT IDENTITY(1,1) CONSTRAINT PK_Warehouses PRIMARY KEY,
	WarehouseName NVARCHAR(200) NOT NULL,
	[Location] GEOGRAPHY NOT NULL,
	[Address] NVARCHAR(500) NULL,
	[isActive] BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Categories(
	CategoryID INT NOT NULL IDENTITY(1,1) CONSTRAINT PK_Categories PRIMARY KEY,
	CategoryName NVARCHAR(100) NOT NULL UNIQUE,
);
GO

CREATE TABLE Products(
	ProductID INT IDENTITY(1,1) CONSTRAINT PK_Products PRIMARY KEY,
	ProductName NVARCHAR(200) NOT NULL,
	CategoryID INT NOT NULL CONSTRAINT FK_Products_Categories REFERENCES Categories(CategoryID),
	Unit NVARCHAR(50) NOT NULL,
);
GO

CREATE TABLE WarehouseStock(
	WarehouseID INT NOT NULL,
	ProductID INT NOT NULL,
	CurrentQuantity DECIMAL(18,2) NOT NULL DEFAULT 0,
	LastUpdated DATETIME2 DEFAULT SYSUTCDATETIME(),
	CONSTRAINT PK_WarehouseStock PRIMARY KEY (WarehouseID, ProductID),
	CONSTRAINT FK_Stock_Warehouses FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
	CONSTRAINT FK_Stock_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

CREATE TABLE InventoryTransactions(
	TxID INT IDENTITY(1,1) CONSTRAINT PK_InventoryTransactions PRIMARY KEY,
	WarehouseID INT NOT NULL,
	ProductID INT NOT NULL,
	TxType INT NOT NULL,-- 0: In, 1: Out, 2: Adjust
	Quantity DECIMAL(18,2) NOT NULL,
	MissionID INT NOT NULL CONSTRAINT FK_InventoryTransactions_RescueMissions REFERENCES RescueMissions(MissionID),
	CreatedByUserID INT NOT NULL,
	CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	CONSTRAINT FK_InventoryTransactions_Products FOREIGN KEY (WarehouseID,ProductID) REFERENCES WarehouseStock(WarehouseID,ProductID),
);
GO

---- OverlutDb_Storage ----
USE OverlutDb_Storage
GO

CREATE TABLE Attachments (
    AttachmentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    IsComplete BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE TABLE FileChunks (
    ChunkID UNIQUEIDENTIFIER PRIMARY KEY NONCLUSTERED DEFAULT NEWSEQUENTIALID() ,
    AttachmentID UNIQUEIDENTIFIER NOT NULL,
    SequenceNumber INT NOT NULL,
    [Data] VARBINARY(MAX) NOT NULL,
    CONSTRAINT FK_FileChunks_Attachments FOREIGN KEY (AttachmentID) REFERENCES Attachments(AttachmentID) ON DELETE CASCADE
);
GO

CREATE CLUSTERED INDEX CIX_Chunks_Blob_Order ON FileChunks(AttachmentID, SequenceNumber);
GO
---
USE OverlutDb
GO

-- ==========================================
-- 1. USERS
-- RoleID mapping: 1=Citizen, 2=RescueTeam, 3=Coordinator, 4=Manager, 5=Admin
-- ==========================================
INSERT INTO Users (RoleID, FullName, IdentifyID, [Address], Email, Phone, [Password], IsActive) VALUES 
(5, N'Admin Nguyễn Văn A', '001099123456', N'Hà Nội', '1@5', '0901234567', 'Abc@1234', 1),
(4, N'Manager Lê Thị B', '002099123457', N'Hải Phòng', '1@4', '0901234568', 'Abc@1234', 1),
(3, N'Coord Trần Văn C', '003099123458', N'Đà Nẵng', '1@3', '0901234569', 'Abc@1234', 1),
(3, N'Coord Phạm Thị D', '004099123459', N'Huế', 'coord2@overlut.com', '0901234570', 'hashed_pwd_4', 1),
(2, N'Team Lead Hoàng E', '005099123460', N'Nghệ An', '1l@2', '0901234571', 'Abc@1234', 1),
(2, N'Team Member Đỗ F', '006099123461', N'Hà Tĩnh', '1m@2', '0901234572', 'Abc@1234', 1),
(1, N'Citizen Ngô G', '007099123462', N'Quảng Bình', '1m@1', '0901234573', 'Abc@1234', 1),
(1, N'Citizen Vũ H', '008099123463', N'Quảng Trị', 'citizen2@overlut.com', '0901234574', 'hashed_pwd_8', 1),
(1, N'Citizen Đặng I', '009099123464', N'TP HCM', 'citizen3@overlut.com', '0901234575', 'hashed_pwd_9', 1),
(1, N'Citizen Bùi K', '010099123465', N'Cần Thơ', 'citizen4@overlut.com', '0901234576', 'hashed_pwd_10', 1);
GO

-- ==========================================
-- 2. REFRESHTOKEN
-- ==========================================
INSERT INTO RefreshToken (UserID, Token, CreatedAt, ExpiredAt, Revoked, IPAddress, UserAgent) VALUES 
(1, 'token_abc_1', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.1', 'Mozilla/5.0'),
(2, 'token_abc_2', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.2', 'Mozilla/5.0'),
(3, 'token_abc_3', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.3', 'Mozilla/5.0'),
(4, 'token_abc_4', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.4', 'Mozilla/5.0'),
(5, 'token_abc_5', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.5', 'Mozilla/5.0'),
(6, 'token_abc_6', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.6', 'Mozilla/5.0'),
(7, 'token_abc_7', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.7', 'Mozilla/5.0'),
(8, 'token_abc_8', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.8', 'Mozilla/5.0'),
(9, 'token_abc_9', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 1, '192.168.1.9', 'Mozilla/5.0'),
(10, 'token_abc_10', SYSUTCDATETIME(), DATEADD(day, 7, SYSUTCDATETIME()), 0, '192.168.1.10', 'Mozilla/5.0');
GO

-- ==========================================
-- 3. CATEGORIES
-- ==========================================
INSERT INTO Categories (CategoryName) VALUES 
(N'Lương thực khô'), (N'Nước uống'), (N'Thuốc men'), (N'Dụng cụ y tế'), 
(N'Phao cứu sinh'), (N'Đèn pin'), (N'Chăn màn'), (N'Quần áo'), 
(N'Dụng cụ sửa chữa'), (N'Nhiên liệu');
GO

-- ==========================================
-- 4. PRODUCTS
-- ==========================================
INSERT INTO Products (ProductName, CategoryID, Unit) VALUES 
(N'Mì tôm Hảo Hảo', 1, N'Thùng'), (N'Lương khô Hải Châu', 1, N'Hộp'),
(N'Nước suối Aquafina 500ml', 2, N'Thùng'), (N'Nước suối 5L', 2, N'Chai'),
(N'Thuốc hạ sốt Paracetamol', 3, N'Hộp'), (N'Băng gạc cá nhân', 4, N'Hộp'),
(N'Áo phao tự phồng', 5, N'Chiếc'), (N'Đèn pin siêu sáng', 6, N'Chiếc'),
(N'Chăn dạ', 7, N'Chiếc'), (N'Xăng RON 95', 10, N'Lít');
GO

-- ==========================================
-- 5. RESCUE TEAMS
-- StatusID mapping: 1=Available, 2=Busy, 3=Offline
-- ==========================================
INSERT INTO RescueTeams (TeamName, StatusID, IsActive) VALUES 
(N'Đội Cứu Hộ Alpha', 1, 1), (N'Đội Cứu Hộ Beta', 2, 1), (N'Đội Cứu Hộ Gamma', 1, 1),
(N'Đội Hỗ Trợ Y Tế 1', 1, 1), (N'Đội Hỗ Trợ Y Tế 2', 2, 1), (N'Đội Xuồng Máy 1', 1, 1),
(N'Đội Xuồng Máy 2', 3, 1), (N'Đội Vận Chuyển A', 1, 1), (N'Đội Vận Chuyển B', 1, 1),
(N'Đội Dự Bị C', 3, 0);
GO

-- ==========================================
-- 6. RESCUE TEAM MEMBERS
-- UserID, TeamID, RoleID (0=Leader, 1=Member)
-- ==========================================
INSERT INTO RescueTeamMembers (UserID, TeamID, RoleID) VALUES 
(1, 1, 0), (2, 1, 1), (3, 2, 0), (4, 2, 1), (5, 3, 0),
(6, 3, 1), (7, 4, 0), (8, 4, 1), (9, 5, 0), (10, 5, 1);
GO

-- ==========================================
-- 7. VEHICLES
-- VehicleType: 1=Boat, 2=Truck, 3=Ambulance
-- StatusID: 1=Available, 2=InUse, 3=Maintenance
-- ==========================================
INSERT INTO Vehicles (VehicleCode, VehicleType, Capacity, StatusID, Note) VALUES 
('BOAT-001', 1, 10, 1, N'Xuồng cao su'), ('BOAT-002', 1, 15, 2, N'Ca nô composite'),
('TRUCK-001', 2, 5000, 1, N'Xe tải thùng bạt 5 tấn'), ('TRUCK-002', 2, 8000, 1, N'Xe tải 8 tấn'),
('AMB-001', 3, 2, 1, N'Xe cứu thương tiêu chuẩn'), ('AMB-002', 3, 2, 2, N'Xe cứu thương ICU'),
('BOAT-003', 1, 5, 3, N'Đang bảo dưỡng động cơ'), ('TRUCK-003', 2, 15000, 1, N'Xe siêu trường'),
('TRUCK-004', 2, 2500, 1, N'Xe tải nhẹ'), ('AMB-003', 3, 2, 1, N'Trạm xá lưu động');
GO

-- ==========================================
-- 8. RESCUE MISSIONS
-- NOTE: RescueRequestID uses 1-10 (Cần insert bảng RescueRequests trước khi chạy)
-- StatusID: 1=Assigned, 2=EnRoute, 3=Rescuing, 4=Completed, 5=Failed
-- ==========================================
INSERT INTO RescueMissions (RescueRequestID, CoordinatorUserID, TeamID, StatusID, [Description]) VALUES 
(1, 3, 1, 2, N'Cứu hộ vùng ngập lụt sâu'), (2, 3, 2, 3, N'Cung cấp nhu yếu phẩm'),
(3, 4, 3, 1, N'Di dời người già và trẻ em'), (4, 4, 4, 4, N'Sơ cứu người bị thương'),
(5, 3, 5, 2, N'Tiếp tế lương thực khẩn cấp'), (6, 4, 6, 1, N'Mở đường thủy tiếp cận'),
(7, 3, 7, 5, N'Hủy nhiệm vụ do bão quá to'), (8, 4, 8, 4, N'Hoàn thành đưa người tới nơi an toàn'),
(9, 3, 9, 2, N'Chuyển bệnh nhân lên tuyến trên'), (10, 4, 1, 1, N'Kiểm tra rà soát sau bão');
GO

-- ==========================================
-- 9. MISSION LOGS
-- ==========================================
INSERT INTO MissionLogs (MissionID, OldRescueMissions, ChangedByUserID, ChangedAt) VALUES 
(1, N'Status: Assigned', 3, SYSUTCDATETIME()), (2, N'Status: EnRoute', 3, SYSUTCDATETIME()),
(3, N'Status: New', 4, SYSUTCDATETIME()), (4, N'Status: Rescuing', 4, SYSUTCDATETIME()),
(5, N'Team changed', 3, SYSUTCDATETIME()), (6, N'Description updated', 4, SYSUTCDATETIME()),
(7, N'Status: Rescuing', 3, SYSUTCDATETIME()), (8, N'Status: Assigned', 4, SYSUTCDATETIME()),
(9, N'Status: New', 3, SYSUTCDATETIME()), (10, N'Description added', 4, SYSUTCDATETIME());
GO

-- ==========================================
-- 10. ATTACHMENT MISSION
-- ==========================================
INSERT INTO AttachmentMission (AttachmentID, MissionID, FileSize, FileType) VALUES 
(NEWID(), 1, 2048576, 'image/jpeg'), (NEWID(), 2, 512000, 'image/png'),
(NEWID(), 3, 10485760, 'video/mp4'), (NEWID(), 4, 300000, 'application/pdf'),
(NEWID(), 5, 2048576, 'image/jpeg'), (NEWID(), 6, 150000, 'image/png'),
(NEWID(), 7, 5000000, 'video/avi'), (NEWID(), 8, 400000, 'application/pdf'),
(NEWID(), 9, 2048576, 'image/jpeg'), (NEWID(), 10, 100000, 'image/png');
GO

-- ==========================================
-- 11. VEHICLE ASSIGNMENTS
-- ==========================================
INSERT INTO VehicleAssignments (MissionID, VehicleID, AssignedAt) VALUES 
(1, 1, SYSUTCDATETIME()), (2, 2, SYSUTCDATETIME()), (3, 3, SYSUTCDATETIME()),
(4, 5, SYSUTCDATETIME()), (5, 6, SYSUTCDATETIME()), (6, 4, SYSUTCDATETIME()),
(7, 7, SYSUTCDATETIME()), (8, 8, SYSUTCDATETIME()), (9, 9, SYSUTCDATETIME()),
(10, 10, SYSUTCDATETIME());
GO

-- ==========================================
-- 12. WAREHOUSE STOCK
-- NOTE: WarehouseID uses 1-10 (Cần insert bảng Warehouses trước khi chạy)
-- ==========================================
INSERT INTO WarehouseStock (WarehouseID, ProductID, CurrentQuantity) VALUES 
(1, 1, 500.00), (1, 2, 1000.00), (2, 3, 200.00), (2, 4, 150.00),
(3, 5, 50.00), (3, 6, 300.00), (4, 7, 20.00), (4, 8, 100.00),
(5, 9, 60.00), (5, 10, 500.00);
GO

-- ==========================================
-- 13. INVENTORY TRANSACTIONS
-- TxType: 0=In, 1=Out, 2=Adjust
-- ==========================================
INSERT INTO InventoryTransactions (WarehouseID, ProductID, TxType, Quantity, MissionID, CreatedByUserID) VALUES 
(1, 1, 1, 50.00, 1, 4), (1, 2, 1, 100.00, 2, 4), (2, 3, 1, 20.00, 3, 3),
(2, 4, 1, 10.00, 4, 3), (3, 5, 1, 5.00, 5, 4), (3, 6, 1, 30.00, 6, 4),
(4, 7, 1, 2.00, 7, 3), (4, 8, 1, 10.00, 8, 3), (5, 9, 1, 5.00, 9, 4),
(5, 10, 1, 50.00, 10, 4);
GO