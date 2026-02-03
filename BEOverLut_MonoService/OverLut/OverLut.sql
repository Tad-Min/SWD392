USE master
GO
----DROP DB----
DROP DATABASE IF EXISTS OverlutDb
GO
DROP DATABASE IF EXISTS OverlutDb_Storage
GO


----CREATE DB----
CREATE DATABASE OverlutDb
GO
CREATE DATABASE OverlutDb_Storage
GO

---- OverlutDb ----
USE OverlutDb
GO

CREATE TABLE Roles(
RoleID INT NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
RoleName NVARCHAR(255) NOT NULL CONSTRAINT UQ_Roles_RoleName UNIQUE
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
	Jti NVARCHAR(100) UNIQUE,
	CreatedAt DATETIME NOT NULL,
	ExpiredAt DATETIME NOT NULL,
	Revoked BIT NOT NULL DEFAULT 0,
	IPAddress NVARCHAR(255),
	UserAgent NVARCHAR(MAX)
);
CREATE TABLE LogLogin(
	LogId INT PRIMARY KEY IDENTITY(1,1),
	RefreshTokenId INT NULL CONSTRAINT FK_LogLogin_RefreshToken FOREIGN KEY REFERENCES RefreshToken(RefreshTokenId),
	Success BIT NOT NULL DEFAULT 0,
	FailReason NVARCHAR(255),
	IPAddress NVARCHAR(255),
	UserAgent NVARCHAR(MAX),
	LoginTime DATETIME NOT NULL DEFAULT GETDATE()
);
CREATE TABLE AccessTokenBlacklist(
	Jti VARCHAR(50) PRIMARY KEY,
	UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
	ExpireAt DATETIME NOT NULL,
	Reason NVARCHAR(500)
);
GO

CREATE TABLE RescueRequestsStatus(
	RescueRequestsStatusID INT NOT NULL CONSTRAINT  PK_RescueRequestsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueRequestsStatus_StatusName UNIQUE,
);
GO
-- 0: New, 1: Verified, 2: Assigned, 3: EnRoute, 4: OnSite, 5: Resolved, 6: Cancelled, 7: DuplicateMerged
INSERT RescueRequestsStatus(RescueRequestsStatusID, StatusName) VALUES (0,N'New'),(1,N'Verified'),(2,N'Assigned'),(3,N'EnRoute'),(4,N'OnSite'),(5,N'Resolved'),(6,N'Cancelled'),(7,N'DuplicateMerged');
CREATE TABLE RescueRequestsTypes(
	RescueRequestsTypeID INT NOT NULL CONSTRAINT  PK_RescueRequestsTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueRequestsTypes_TypeName UNIQUE , 
);
GO
-- 0: Rescue, 1: Relief, 2: Both
INSERT RescueRequestsTypes(RescueRequestsTypeID, TypeName) VALUES (0,N'Rescue'),(1,N'Relief'),(2,N'Both');
CREATE TABLE UrgencyLevels(
	UrgencyLevelID INT NOT NULL CONSTRAINT  PK_UrgencyLevel PRIMARY KEY,
	UrgencyName NVARCHAR(100) NOT NULL CONSTRAINT UQ_UrgencyLevels_TypeName UNIQUE
);
GO
INSERT UrgencyLevels(UrgencyLevelID, UrgencyName) VALUES (1,N'Normal'),(2,N'High'),(3,N'Critical');

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
	RescueMissionsStatusID INT NOT NULL CONSTRAINT PK_RescueMissionsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueMissionsStatus_StatusName UNIQUE
);
GO

-- 0 Assigned, 1 EnRoute, 2 Rescuing, 3 Completed, 4 Failed
INSERT RescueMissionsStatus(RescueMissionsStatusID, StatusName) VALUES (0,N'Assigned'),(1,N'EnRoute'),(2,N'Rescuing'),(3,N'Completed'),(4,N'Failed');

CREATE TABLE RescueMissions(
  MissionID INT NOT NULL IDENTITY(1,1) CONSTRAINT PK_RescueMissions PRIMARY KEY,
  RescueRequestID INT NOT NULL CONSTRAINT FK_RescueMissions_RescueRequests REFERENCES  RescueRequests(RescueRequestID),
  CoordinatorUserID INT NOT NULL  CONSTRAINT FK_RescueMissions_Users REFERENCES  Users(UserID),
  TeamID INT NOT NULL,
  StatusID INT NOT NULL CONSTRAINT FK_RescueMissions_RescueMissionsStatus REFERENCES RescueMissionsStatus(RescueMissionsStatusID),
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
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
	VehicleTypeID INT NOT NULL CONSTRAINT PK_VehiclesTypes PRIMARY KEY,
	TypeName NVARCHAR(100) NOT NULL CONSTRAINT UQ_VehiclesTypes_TypeName UNIQUE
);
GO
-- 0: boat, 1: truck, 2: ambulance
INSERT VehiclesTypes(VehicleTypeID, TypeName) VALUES (0,N'Boat'),(1,N'Truck'),(2,N'Ambulance');

CREATE TABLE VehiclesStatus(
	VehiclesStatusID INT NOT NULL CONSTRAINT PK_VehiclesStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_VehiclesStatus_StatusName UNIQUE
);
GO
 -- 0: Available, 1: InUse, 2: Maintenance
INSERT VehiclesStatus(VehiclesStatusID, StatusName) VALUES (0,N'Available'),(1,N'InUse'),(2,N'Maintenance');

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
	RescueTeamsStatusID INT NOT NULL CONSTRAINT PK_RescueTeamsStatus PRIMARY KEY,
	StatusName NVARCHAR(100) NOT NULL CONSTRAINT UQ_RescueTeamsStatus_StatusName UNIQUE
);
GO
-- 0: Available, 1: Busy, 2: Offline
INSERT RescueTeamsStatus(RescueTeamsStatusID, StatusName) VALUES (0,N'Available'),(1,N'Busy'),(2,N'Offline');

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
INSERT RescueMembersRolls(RescueMembersRollID, RollName) VALUES (0,N'Leader'),(1,N'Member');

CREATE TABLE RescueTeamMembers(
	UserID INT NOT NULL CONSTRAINT FK_RescueTeamMembers_Users REFERENCES Users(UserID),
	TeamID INT NOT NULL CONSTRAINT FK_TeamMembers_Team REFERENCES RescueTeams(TeamID) ON DELETE CASCADE,
	RoleID INT NOT NULL DEFAULT 0 CONSTRAINT FK_RescueTeamMembers_RescueMembersRolls REFERENCES RescueMembersRolls(RescueMembersRollID),
	CONSTRAINT PK_RescueTeamMembers PRIMARY KEY (UserID),
);
GO

CREATE TABLE Warehouses(
	WarehouseID INT IDENTITY(1,1) CONSTRAINT PK_Warehouses PRIMARY KEY,
	WarehouseName NVARCHAR(200) NOT NULL,
	[Location] GEOGRAPHY NOT NULL,
	LocationText NVARCHAR(500) NULL,
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