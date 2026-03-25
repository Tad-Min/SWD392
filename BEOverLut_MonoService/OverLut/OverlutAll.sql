USE master;
GO
---- 1. DROP & CREATE DATABASES ----
DROP DATABASE IF EXISTS OverlutDb;
GO
DROP DATABASE IF EXISTS OverlutDb_Storage;
GO

CREATE DATABASE OverlutDb;
GO
CREATE DATABASE OverlutDb_Storage;
GO

---- 2. SETUP STORAGE DATABASE ----
USE OverlutDb_Storage;
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

---- 3. SETUP MAIN DATABASE SCHEMA ----
USE OverlutDb;
GO

-- EF Migrations History
CREATE TABLE [__EFMigrationsHistory] (
    [MigrationId] nvarchar(150) NOT NULL,
    [ProductVersion] nvarchar(32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
);
GO

-- Base Dictionary Tables
CREATE TABLE [Categories] (
    [CategoryID] int NOT NULL IDENTITY,
    [CategoryName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([CategoryID]),
    CONSTRAINT [UQ__Categori__8517B2E0DB728485] UNIQUE ([CategoryName])
);

CREATE TABLE [RescueMembersRoles] (
    [RescueMembersRoleID] int NOT NULL,
    [RoleName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_RescueMembersRoles] PRIMARY KEY ([RescueMembersRoleID]),
    CONSTRAINT [UQ_RescueMembersRoles_RollName] UNIQUE ([RoleName])
);

CREATE TABLE [RescueMissionsStatus] (
    [RescueMissionsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_RescueMissionsStatus] PRIMARY KEY ([RescueMissionsStatusID]),
    CONSTRAINT [UQ_RescueMissionsStatus_StatusName] UNIQUE ([StatusName])
);

CREATE TABLE [RescueRequestsStatus] (
    [RescueRequestsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_RescueRequestsStatus] PRIMARY KEY ([RescueRequestsStatusID])
);

CREATE TABLE [RescueRequestsTypes] (
    [RescueRequestsTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_RescueRequestsTypes] PRIMARY KEY ([RescueRequestsTypeID])
);

CREATE TABLE [RescueTeamsStatus] (
    [RescueTeamsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_RescueTeamsStatus] PRIMARY KEY ([RescueTeamsStatusID])
);

CREATE TABLE [Roles] (
    [RoleID] int NOT NULL,
    [RoleName] nvarchar(255) NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([RoleID]),
    CONSTRAINT [UQ_Roles_RoleName] UNIQUE ([RoleName])
);

CREATE TABLE [UrgencyLevels] (
    [UrgencyLevelID] int NOT NULL IDENTITY,
    [UrgencyName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_UrgencyLevel] PRIMARY KEY ([UrgencyLevelID])
);

CREATE TABLE [VehiclesStatus] (
    [VehiclesStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_VehiclesStatus] PRIMARY KEY ([VehiclesStatusID])
);

CREATE TABLE [VehiclesTypes] (
    [VehicleTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_VehiclesTypes] PRIMARY KEY ([VehicleTypeID])
);

CREATE TABLE [VolunteerOfferTypes] (
    [OfferTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsTypicallyReturnable] bit NOT NULL,
    CONSTRAINT [PK_VolunteerOfferTypes] PRIMARY KEY ([OfferTypeID]),
    CONSTRAINT [UQ_VolunteerOfferTypes_TypeName] UNIQUE ([TypeName])
);

CREATE TABLE [VolunteerSkillTypes] (
    [SkillTypeID] int NOT NULL IDENTITY,
    [SkillName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_VolunteerSkillTypes] PRIMARY KEY ([SkillTypeID]),
    CONSTRAINT [UQ_VolunteerSkillTypes_SkillName] UNIQUE ([SkillName])
);

CREATE TABLE [Warehouses] (
    [WarehouseID] int NOT NULL IDENTITY,
    [WarehouseName] nvarchar(200) NOT NULL,
    [Location] geography NOT NULL,
    [Address] nvarchar(500) NULL,
    [isActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Warehouses] PRIMARY KEY ([WarehouseID])
);
GO

-- Main & Operation Tables
CREATE TABLE [Products] (
    [ProductID] int NOT NULL IDENTITY,
    [ProductName] nvarchar(200) NOT NULL,
    [CategoryID] int NOT NULL,
    [Unit] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([ProductID]),
    CONSTRAINT [FK_Products_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [Categories] ([CategoryID])
);

CREATE TABLE [RescueTeams] (
    [TeamID] int NOT NULL IDENTITY,
    [TeamName] nvarchar(200) NOT NULL,
    [StatusID] int NOT NULL DEFAULT 0,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [IsActive] bit NOT NULL DEFAULT 0,
    [AssemblyLocationText] nvarchar(500) NULL,
    [AssemblyLatitude] float NULL,
    [AssemblyLongitude] float NULL,
    [AssemblyNote] nvarchar(500) NULL,
    [RoleID] int NULL, -- Merged from Migration 20260324133216
    CONSTRAINT [PK_RescueTeams] PRIMARY KEY ([TeamID]),
    CONSTRAINT [FK_RescueTeams_RescueTeamsStatus] FOREIGN KEY ([StatusID]) REFERENCES [RescueTeamsStatus] ([RescueTeamsStatusID]),
    CONSTRAINT [FK_RescueTeams_RescueMembersRoles] FOREIGN KEY ([RoleID]) REFERENCES [RescueMembersRoles] ([RescueMembersRoleID])
);

CREATE TABLE [Users] (
    [UserID] int NOT NULL IDENTITY,
    [RoleID] int NOT NULL,
    [FullName] nvarchar(150) NULL,
    [IdentifyID] varchar(13) NULL,
    [Address] nvarchar(500) NULL,
    [Email] nvarchar(200) NOT NULL,
    [Phone] varchar(12) NULL,
    [Password] nvarchar(100) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserID]),
    CONSTRAINT [FK_Users_Roles] FOREIGN KEY ([RoleID]) REFERENCES [Roles] ([RoleID]),
    CONSTRAINT [UQ_Users_Email] UNIQUE ([Email])
);

CREATE TABLE [Vehicles] (
    [VehicleID] int NOT NULL IDENTITY,
    [VehicleCode] nvarchar(50) NOT NULL,
    [VehicleType] int NOT NULL,
    [Capacity] int NULL,
    [StatusID] int NOT NULL,
    [Note] nvarchar(500) NULL,
    CONSTRAINT [PK_Vehicles] PRIMARY KEY ([VehicleID]),
    CONSTRAINT [FK_Vehicles_VehiclesStatus] FOREIGN KEY ([StatusID]) REFERENCES [VehiclesStatus] ([VehiclesStatusID]),
    CONSTRAINT [FK_Vehicles_VehiclesTypes] FOREIGN KEY ([VehicleType]) REFERENCES [VehiclesTypes] ([VehicleTypeID]),
    CONSTRAINT [UQ_Vehicles_VehicleCode] UNIQUE ([VehicleCode])
);

CREATE TABLE [WarehouseStock] (
    [WarehouseID] int NOT NULL,
    [ProductID] int NOT NULL,
    [CurrentQuantity] decimal(18,2) NOT NULL DEFAULT 0,
    [LastUpdated] datetime2 NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_WarehouseStock] PRIMARY KEY ([WarehouseID], [ProductID]),
    CONSTRAINT [FK_Stock_Products] FOREIGN KEY ([ProductID]) REFERENCES [Products] ([ProductID]),
    CONSTRAINT [FK_Stock_Warehouses] FOREIGN KEY ([WarehouseID]) REFERENCES [Warehouses] ([WarehouseID])
);

CREATE TABLE [RefreshToken] (
    [RefreshTokenId] int NOT NULL IDENTITY,
    [UserID] int NULL,
    [Token] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ExpiredAt] datetime2 NOT NULL,
    [Revoked] bit NOT NULL DEFAULT 0,
    [IPAddress] nvarchar(255) NULL,
    [UserAgent] nvarchar(max) NULL,
    CONSTRAINT [PK__RefreshT__F5845E392455FC9A] PRIMARY KEY ([RefreshTokenId]),
    CONSTRAINT [FK__RefreshTo__UserI__2D27B809] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [UQ__RefreshT__1EB4F8175D3536C7] UNIQUE ([Token])
);

CREATE TABLE [RescueRequests] (
    [RescueRequestID] int NOT NULL IDENTITY,
    [UserReqID] int NULL,
    [RequestType] int NOT NULL,
    [UrgencyLevel] int NULL,
    [IPAddress] nvarchar(50) NULL,
    [UserAgent] nvarchar(max) NULL,
    [Status] int NOT NULL,
    [Description] nvarchar(500) NULL,
    [PeopleCount] int NULL DEFAULT 1,
    [Location] geography NULL,
    [LocationText] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_RescueRequests] PRIMARY KEY ([RescueRequestID]),
    CONSTRAINT [FK_RescueRequests_RescueRequestsStatus] FOREIGN KEY ([Status]) REFERENCES [RescueRequestsStatus] ([RescueRequestsStatusID]),
    CONSTRAINT [FK_RescueRequests_RescueRequestsTypes] FOREIGN KEY ([RequestType]) REFERENCES [RescueRequestsTypes] ([RescueRequestsTypeID]),
    CONSTRAINT [FK_RescueRequests_UrgencyLevels] FOREIGN KEY ([UrgencyLevel]) REFERENCES [UrgencyLevels] ([UrgencyLevelID]),
    CONSTRAINT [FK_RescueRequests_UserReqID] FOREIGN KEY ([UserReqID]) REFERENCES [Users] ([UserID])
);

CREATE TABLE [RescueTeamMembers] (
    [MemberID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [TeamID] int NOT NULL,
    [RoleID] int NOT NULL DEFAULT 0,
    [AssignedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [AssignedByUserID] int NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_RescueTeamMembers] PRIMARY KEY ([MemberID]),
    CONSTRAINT [FK_RescueTeamMembers_AssignedByUser] FOREIGN KEY ([AssignedByUserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_RescueTeamMembers_RescueMembersRoles] FOREIGN KEY ([RoleID]) REFERENCES [RescueMembersRoles] ([RescueMembersRoleID]),
    CONSTRAINT [FK_RescueTeamMembers_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_TeamMembers_Team] FOREIGN KEY ([TeamID]) REFERENCES [RescueTeams] ([TeamID]) ON DELETE CASCADE
);

CREATE TABLE [VolunteerOffers] (
    [OfferID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [OfferTypeID] int NOT NULL,
    [OfferName] nvarchar(300) NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [Unit] nvarchar(50) NULL,
    [Description] nvarchar(1000) NULL,
    [IsReturnRequired] bit NOT NULL,
    [AssetCode] nvarchar(100) NULL,
    [CurrentStatus] int NOT NULL DEFAULT 0,
    [DropoffLocationText] nvarchar(500) NULL,
    [DropoffLatitude] float NULL,
    [DropoffLongitude] float NULL,
    [ContactPhone] nvarchar(20) NULL,
    [AvailableFrom] datetime2 NULL,
    [AvailableTo] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [UpdatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_VolunteerOffers] PRIMARY KEY ([OfferID]),
    CONSTRAINT [FK_VolunteerOffers_OfferTypes] FOREIGN KEY ([OfferTypeID]) REFERENCES [VolunteerOfferTypes] ([OfferTypeID]),
    CONSTRAINT [FK_VolunteerOffers_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE
);

CREATE TABLE [VolunteerProfiles] (
    [VolunteerProfileID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [ApplicationStatus] int NOT NULL,
    [ApprovedByManagerId] int NULL,
    [ApprovedAt] datetime2 NULL,
    [RejectedReason] nvarchar(500) NULL,
    [IsAvailable] bit NOT NULL DEFAULT CAST(1 AS bit),
    [Notes] nvarchar(1000) NULL,
    [VolunteerProvince] nvarchar(max) NULL, -- Merged from ADD script
    [VolunteerWard] nvarchar(max) NULL,     -- Merged from ADD script
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [UpdatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_VolunteerProfiles] PRIMARY KEY ([VolunteerProfileID]),
    CONSTRAINT [FK_VolunteerProfiles_Managers] FOREIGN KEY ([ApprovedByManagerId]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_VolunteerProfiles_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE
);

CREATE TABLE [AttachmentRescue] (
    [AttachmentID] uniqueidentifier NOT NULL,
    [RescueRequestID] int NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_RescueRequestAttachments] PRIMARY KEY ([AttachmentID]),
    CONSTRAINT [FK_AttachmentRescue_RescueRequests] FOREIGN KEY ([RescueRequestID]) REFERENCES [RescueRequests] ([RescueRequestID]) ON DELETE CASCADE
);

CREATE TABLE [RescueMissions] (
    [MissionID] int NOT NULL IDENTITY,
    [RescueRequestID] int NOT NULL,
    [CoordinatorUserID] int NOT NULL,
    [TeamID] int NOT NULL,
    [StatusID] int NOT NULL,
    [AssignedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [Description] nvarchar(500) NULL,
    CONSTRAINT [PK_RescueMissions] PRIMARY KEY ([MissionID]),
    CONSTRAINT [FK_RescueMissions_RescueMissionsStatus] FOREIGN KEY ([StatusID]) REFERENCES [RescueMissionsStatus] ([RescueMissionsStatusID]),
    CONSTRAINT [FK_RescueMissions_RescueRequests] FOREIGN KEY ([RescueRequestID]) REFERENCES [RescueRequests] ([RescueRequestID]),
    CONSTRAINT [FK_RescueMissions_Users] FOREIGN KEY ([CoordinatorUserID]) REFERENCES [Users] ([UserID])
);

CREATE TABLE [RescueRequestLogs] (
    [LogID] bigint NOT NULL IDENTITY,
    [RescueRequestID] int NOT NULL,
    [OldRescueRequests] nvarchar(2000) NULL,
    [ChangedByUserID] int NULL,
    [ChangedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_RescueRequestLog] PRIMARY KEY ([LogID], [RescueRequestID]),
    CONSTRAINT [FK_ReqStatusHistory_RescueRequests] FOREIGN KEY ([RescueRequestID]) REFERENCES [RescueRequests] ([RescueRequestID]) ON DELETE CASCADE
);

CREATE TABLE [VolunteerOfferAssignments] (
    [OfferAssignmentID] int NOT NULL IDENTITY,
    [OfferID] int NOT NULL,
    [TeamID] int NULL,
    [MissionId] int NULL,
    [AssignedByManagerID] int NOT NULL,
    [AssignedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [ReceivedAt] datetime2 NULL,
    [ReturnedAt] datetime2 NULL,
    [ReturnConditionNote] nvarchar(500) NULL,
    CONSTRAINT [PK_VolunteerOfferAssignments] PRIMARY KEY ([OfferAssignmentID]),
    CONSTRAINT [FK_VolunteerOfferAssignments_Managers] FOREIGN KEY ([AssignedByManagerID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_VolunteerOfferAssignments_Offers] FOREIGN KEY ([OfferID]) REFERENCES [VolunteerOffers] ([OfferID]) ON DELETE CASCADE,
    CONSTRAINT [FK_VolunteerOfferAssignments_Teams] FOREIGN KEY ([TeamID]) REFERENCES [RescueTeams] ([TeamID])
);

CREATE TABLE [VolunteerSkills] (
    [VolunteerSkillID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [SkillTypeID] int NOT NULL,
    [VolunteerProfileId] int NULL,
    CONSTRAINT [PK_VolunteerSkills] PRIMARY KEY ([VolunteerSkillID]),
    CONSTRAINT [FK_VolunteerSkills_SkillTypes] FOREIGN KEY ([SkillTypeID]) REFERENCES [VolunteerSkillTypes] ([SkillTypeID]) ON DELETE CASCADE,
    CONSTRAINT [FK_VolunteerSkills_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [FK_VolunteerSkills_VolunteerProfiles_VolunteerProfileId] FOREIGN KEY ([VolunteerProfileId]) REFERENCES [VolunteerProfiles] ([VolunteerProfileID]),
    CONSTRAINT [UQ_VolunteerSkills_User_Skill] UNIQUE ([UserID], [SkillTypeID])
);

CREATE TABLE [AttachmentMission] (
    [AttachmentID] uniqueidentifier NOT NULL,
    [MissionID] int NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_AttachmentMission] PRIMARY KEY ([AttachmentID]),
    CONSTRAINT [FK_AttachmentMission_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID]) ON DELETE CASCADE
);

CREATE TABLE [InventoryTransactions] (
    [TxID] int NOT NULL IDENTITY,
    [WarehouseID] int NOT NULL,
    [ProductID] int NOT NULL,
    [TxType] int NOT NULL,
    [Quantity] decimal(18,2) NOT NULL,
    [MissionID] int NOT NULL,
    [CreatedByUserID] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_InventoryTransactions] PRIMARY KEY ([TxID]),
    CONSTRAINT [FK_InventoryTransactions_Products] FOREIGN KEY ([WarehouseID], [ProductID]) REFERENCES [WarehouseStock] ([WarehouseID], [ProductID]),
    CONSTRAINT [FK_InventoryTransactions_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID])
);

CREATE TABLE [MissionLogs] (
    [LogID] bigint NOT NULL IDENTITY,
    [MissionID] int NOT NULL,
    [OldRescueMissions] nvarchar(2000) NULL,
    [ChangedByUserID] int NOT NULL,
    [ChangedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_MissionLogs] PRIMARY KEY ([LogID], [MissionID]),
    CONSTRAINT [FK_MissionLogs_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID]) ON DELETE CASCADE
);

CREATE TABLE [VehicleAssignments] (
    [MissionID] int NOT NULL,
    [VehicleID] int NOT NULL,
    [AssignedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [ReleasedAt] datetime2 NULL,
    CONSTRAINT [PK_VehicleAssignments] PRIMARY KEY ([MissionID], [VehicleID]),
    CONSTRAINT [FK_VehicleAssignments_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID]),
    CONSTRAINT [FK_VehicleAssignments_Vehicle] FOREIGN KEY ([VehicleID]) REFERENCES [Vehicles] ([VehicleID])
);
GO

-- EF Core Indexes Generation
CREATE INDEX [IX_AttachmentMission_MissionID] ON [AttachmentMission] ([MissionID]);
CREATE INDEX [IX_AttachmentRescue_RescueRequestID] ON [AttachmentRescue] ([RescueRequestID]);
CREATE INDEX [IX_InventoryTransactions_MissionID] ON [InventoryTransactions] ([MissionID]);
CREATE INDEX [IX_InventoryTransactions_WarehouseID_ProductID] ON [InventoryTransactions] ([WarehouseID], [ProductID]);
CREATE INDEX [IX_MissionLogs_MissionID] ON [MissionLogs] ([MissionID]);
CREATE INDEX [IX_Products_CategoryID] ON [Products] ([CategoryID]);
CREATE INDEX [IX_RefreshToken_UserID] ON [RefreshToken] ([UserID]);
CREATE INDEX [IX_RescueMissions_CoordinatorUserID] ON [RescueMissions] ([CoordinatorUserID]);
CREATE INDEX [IX_RescueMissions_RescueRequestID] ON [RescueMissions] ([RescueRequestID]);
CREATE INDEX [IX_RescueMissions_StatusID] ON [RescueMissions] ([StatusID]);
CREATE INDEX [IX_RescueRequestLogs_RescueRequestID] ON [RescueRequestLogs] ([RescueRequestID]);
CREATE INDEX [IX_RescueRequests_RequestType] ON [RescueRequests] ([RequestType]);
CREATE INDEX [IX_RescueRequests_Status] ON [RescueRequests] ([Status]);
CREATE INDEX [IX_RescueRequests_UrgencyLevel] ON [RescueRequests] ([UrgencyLevel]);
CREATE INDEX [IX_RescueRequests_UserReqID] ON [RescueRequests] ([UserReqID]);
CREATE INDEX [IX_RescueTeamMembers_AssignedByUserID] ON [RescueTeamMembers] ([AssignedByUserID]);
CREATE INDEX [IX_RescueTeamMembers_RoleID] ON [RescueTeamMembers] ([RoleID]);
CREATE INDEX [IX_RescueTeamMembers_TeamID] ON [RescueTeamMembers] ([TeamID]);
CREATE INDEX [UQ_RescueTeamMembers_User_Team] ON [RescueTeamMembers] ([UserID], [TeamID]);
CREATE INDEX [IX_RescueTeams_StatusID] ON [RescueTeams] ([StatusID]);
CREATE INDEX [IX_RescueTeams_RoleID] ON [RescueTeams] ([RoleID]);
CREATE INDEX [IX_Users_RoleID] ON [Users] ([RoleID]);
CREATE INDEX [IX_VehicleAssignments_VehicleID] ON [VehicleAssignments] ([VehicleID]);
CREATE INDEX [IX_Vehicles_StatusID] ON [Vehicles] ([StatusID]);
CREATE INDEX [IX_Vehicles_VehicleType] ON [Vehicles] ([VehicleType]);
CREATE INDEX [IX_VolunteerOfferAssignments_AssignedByManagerID] ON [VolunteerOfferAssignments] ([AssignedByManagerID]);
CREATE INDEX [IX_VolunteerOfferAssignments_OfferID] ON [VolunteerOfferAssignments] ([OfferID]);
CREATE INDEX [IX_VolunteerOfferAssignments_TeamID] ON [VolunteerOfferAssignments] ([TeamID]);
CREATE INDEX [IX_VolunteerOffers_OfferTypeID] ON [VolunteerOffers] ([OfferTypeID]);
CREATE INDEX [IX_VolunteerOffers_UserID] ON [VolunteerOffers] ([UserID]);
CREATE INDEX [IX_VolunteerProfiles_ApprovedByManagerId] ON [VolunteerProfiles] ([ApprovedByManagerId]);
CREATE UNIQUE INDEX [IX_VolunteerProfiles_UserID] ON [VolunteerProfiles] ([UserID]);
CREATE INDEX [IX_VolunteerSkills_SkillTypeID] ON [VolunteerSkills] ([SkillTypeID]);
CREATE INDEX [IX_VolunteerSkills_VolunteerProfileId] ON [VolunteerSkills] ([VolunteerProfileId]);
CREATE INDEX [IX_WarehouseStock_ProductID] ON [WarehouseStock] ([ProductID]);
GO

---- 4. SEED DATA / MASTER DATA ----
-- Insert Roles (Merged S1 & S3)
INSERT INTO Roles(RoleID, RoleName) VALUES 
(1,N'Citizen'), (2,N'RescueTeam'), (3,N'RescueCoordinator'), 
(4,N'Manager'), (5,N'Admin'), (6, N'Volunteer');

-- Insert RescueMembersRoles (Merged S1 & S2)
INSERT INTO RescueMembersRoles(RescueMembersRoleID, RoleName) VALUES 
(0,N'Leader'), (1,N'Member'), (2, N'Cứu trợ y tế'), 
(3, N'Logistic'), (4, N'Cứu trợ trực tiếp');

-- Insert Request Dictionaries
INSERT INTO RescueRequestsStatus(StatusName) VALUES (N'New'),(N'Verified'),(N'Assigned'),(N'EnRoute'),(N'OnSite'),(N'Resolved'),(N'Cancelled'),(N'DuplicateMerged');
INSERT INTO RescueRequestsTypes(TypeName) VALUES (N'Rescue'),(N'Relief'),(N'Both');
INSERT INTO UrgencyLevels(UrgencyName) VALUES (N'Normal'),(N'High'),(N'Critical');

-- Insert Mission & Vehicle Dictionaries
INSERT INTO RescueMissionsStatus(StatusName) VALUES (N'Assigned'),(N'EnRoute'),(N'Rescuing'),(N'Completed'),(N'Failed');
INSERT INTO VehiclesTypes(TypeName) VALUES (N'Boat'),(N'Truck'),(N'Ambulance');
INSERT INTO VehiclesStatus(StatusName) VALUES (N'Available'),(N'InUse'),(N'Maintenance');
INSERT INTO RescueTeamsStatus(StatusName) VALUES (N'Available'),(N'Busy'),(N'Offline');

-- Insert Volunteer Dictionaries (From S4)
SET IDENTITY_INSERT [VolunteerOfferTypes] ON;
INSERT INTO [VolunteerOfferTypes] ([OfferTypeID], [IsTypicallyReturnable], [TypeName]) VALUES 
(1, CAST(0 AS bit), N'Food'), (2, CAST(1 AS bit), N'LifeJacket'),
(3, CAST(1 AS bit), N'Boat'), (4, CAST(0 AS bit), N'MedicalSupplies'),
(5, CAST(1 AS bit), N'RescueEquipment'), (6, CAST(0 AS bit), N'Other');
SET IDENTITY_INSERT [VolunteerOfferTypes] OFF;

SET IDENTITY_INSERT [VolunteerSkillTypes] ON;
INSERT INTO [VolunteerSkillTypes] ([SkillTypeID], [SkillName]) VALUES 
(1, N'MedicalSupport'), (2, N'DirectRescuer'), (3, N'LogisticsSupport'), (4, N'BoatOperator');
SET IDENTITY_INSERT [VolunteerSkillTypes] OFF;

-- Insert Users
INSERT INTO Users (RoleID, FullName, IdentifyID, [Address], Email, Phone, [Password], IsActive) VALUES 
(5, N'Admin Nguyễn Văn A', '001099123456', N'Hà Nội', '1@5', '0901234567', 'Giahuy123@', 1),
(4, N'Manager Lê Thị B', '002099123457', N'Hải Phòng', '1@4', '0901234568', 'Giahuy123@', 1),
(3, N'Coord Trần Văn C', '003099123458', N'Đà Nẵng', '1@3', '0901234569', 'Giahuy123@', 1),
(3, N'Coord Phạm Thị D', '004099123459', N'Huế', 'coord2@overlut.com', '0901234570', 'Giahuy123@', 1),
(2, N'Team Lead Hoàng E', '005099123460', N'Nghệ An', '1@2', '0901234571', 'Giahuy123@', 1),
(2, N'Team Member Đỗ F', '006099123461', N'Hà Tĩnh', '1m@2', '0901234572', 'Giahuy123@', 1),
(1, N'Citizen Ngô G', '007099123462', N'Quảng Bình', '1@1', '0901234573', 'Giahuy123@', 1),
(1, N'Citizen Vũ H', '008099123463', N'Quảng Trị', 'citizen2@overlut.com', '0901234574', 'Giahuy123@', 1),
(1, N'Citizen Đặng I', '009099123464', N'TP HCM', 'citizen3@overlut.com', '0901234575', 'Giahuy123@', 1),
(1, N'Citizen Bùi K', '010099123465', N'Cần Thơ', 'citizen4@overlut.com', '0901234576', 'Giahuy123@', 1);

-- Insert Refresh Tokens
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

-- Insert Categories & Products
INSERT INTO Categories (CategoryName) VALUES 
(N'Lương thực khô'), (N'Nước uống'), (N'Thuốc men'), (N'Dụng cụ y tế'), 
(N'Phao cứu sinh'), (N'Đèn pin'), (N'Chăn màn'), (N'Quần áo'), 
(N'Dụng cụ sửa chữa'), (N'Nhiên liệu');

INSERT INTO Products (ProductName, CategoryID, Unit) VALUES 
(N'Mì tôm Hảo Hảo', 1, N'Thùng'), (N'Lương khô Hải Châu', 1, N'Hộp'),
(N'Nước suối Aquafina 500ml', 2, N'Thùng'), (N'Nước suối 5L', 2, N'Chai'),
(N'Thuốc hạ sốt Paracetamol', 3, N'Hộp'), (N'Băng gạc cá nhân', 4, N'Hộp'),
(N'Áo phao tự phồng', 5, N'Chiếc'), (N'Đèn pin siêu sáng', 6, N'Chiếc'),
(N'Chăn dạ', 7, N'Chiếc'), (N'Xăng RON 95', 10, N'Lít');

-- Insert Rescue Teams & Members
INSERT INTO RescueTeams (TeamName, StatusID, IsActive) VALUES 
(N'Đội Cứu Hộ Alpha', 1, 1), (N'Đội Cứu Hộ Beta', 2, 1), (N'Đội Cứu Hộ Gamma', 1, 1),
(N'Đội Hỗ Trợ Y Tế 1', 1, 1), (N'Đội Hỗ Trợ Y Tế 2', 2, 1), (N'Đội Xuồng Máy 1', 1, 1),
(N'Đội Xuồng Máy 2', 3, 1), (N'Đội Vận Chuyển A', 1, 1), (N'Đội Vận Chuyển B', 1, 1),
(N'Đội Dự Bị C', 3, 0);

INSERT INTO RescueTeamMembers (UserID, TeamID, RoleID) VALUES 
(1, 1, 0), (2, 1, 1), (3, 2, 0), (4, 2, 1), (5, 3, 0),
(6, 3, 1), (7, 4, 0), (8, 4, 1), (9, 5, 0), (10, 5, 1);

-- Insert Vehicles
INSERT INTO Vehicles (VehicleCode, VehicleType, Capacity, StatusID, Note) VALUES 
('BOAT-001', 1, 10, 1, N'Xuồng cao su'), ('BOAT-002', 1, 15, 2, N'Ca nô composite'),
('TRUCK-001', 2, 5000, 1, N'Xe tải thùng bạt 5 tấn'), ('TRUCK-002', 2, 8000, 1, N'Xe tải 8 tấn'),
('AMB-001', 3, 2, 1, N'Xe cứu thương tiêu chuẩn'), ('AMB-002', 3, 2, 2, N'Xe cứu thương ICU'),
('BOAT-003', 1, 5, 3, N'Đang bảo dưỡng động cơ'), ('TRUCK-003', 2, 15000, 1, N'Xe siêu trường'),
('TRUCK-004', 2, 2500, 1, N'Xe tải nhẹ'), ('AMB-003', 3, 2, 1, N'Trạm xá lưu động');

-- EF Migrations History Logging
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260323182636_AddVolunteerManagement', N'8.0.25');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260324133216_AddRoleIdToRescueTeam', N'8.0.25');
GO