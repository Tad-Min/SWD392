IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Categories] (
    [CategoryID] int NOT NULL IDENTITY,
    [CategoryName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([CategoryID])
);
GO

CREATE TABLE [RescueMembersRoles] (
    [RescueMembersRoleID] int NOT NULL,
    [RoleName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_RescueMembersRoles] PRIMARY KEY ([RescueMembersRoleID])
);
GO

CREATE TABLE [RescueMissionsStatus] (
    [RescueMissionsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_RescueMissionsStatus] PRIMARY KEY ([RescueMissionsStatusID])
);
GO

CREATE TABLE [RescueRequestsStatus] (
    [RescueRequestsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_RescueRequestsStatus] PRIMARY KEY ([RescueRequestsStatusID])
);
GO

CREATE TABLE [RescueRequestsTypes] (
    [RescueRequestsTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_RescueRequestsTypes] PRIMARY KEY ([RescueRequestsTypeID])
);
GO

CREATE TABLE [RescueTeamsStatus] (
    [RescueTeamsStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_RescueTeamsStatus] PRIMARY KEY ([RescueTeamsStatusID])
);
GO

CREATE TABLE [Roles] (
    [RoleID] int NOT NULL,
    [RoleName] nvarchar(255) NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([RoleID])
);
GO

CREATE TABLE [UrgencyLevels] (
    [UrgencyLevelID] int NOT NULL IDENTITY,
    [UrgencyName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_UrgencyLevel] PRIMARY KEY ([UrgencyLevelID])
);
GO

CREATE TABLE [VehiclesStatus] (
    [VehiclesStatusID] int NOT NULL IDENTITY,
    [StatusName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_VehiclesStatus] PRIMARY KEY ([VehiclesStatusID])
);
GO

CREATE TABLE [VehiclesTypes] (
    [VehicleTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_VehiclesTypes] PRIMARY KEY ([VehicleTypeID])
);
GO

CREATE TABLE [VolunteerOfferTypes] (
    [OfferTypeID] int NOT NULL IDENTITY,
    [TypeName] nvarchar(100) NOT NULL,
    [IsTypicallyReturnable] bit NOT NULL,
    CONSTRAINT [PK_VolunteerOfferTypes] PRIMARY KEY ([OfferTypeID])
);
GO

CREATE TABLE [VolunteerSkillTypes] (
    [SkillTypeID] int NOT NULL IDENTITY,
    [SkillName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_VolunteerSkillTypes] PRIMARY KEY ([SkillTypeID])
);
GO

CREATE TABLE [Warehouses] (
    [WarehouseID] int NOT NULL IDENTITY,
    [WarehouseName] nvarchar(200) NOT NULL,
    [Location] geography NOT NULL,
    [Address] nvarchar(500) NULL,
    [isActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Warehouses] PRIMARY KEY ([WarehouseID])
);
GO

CREATE TABLE [Products] (
    [ProductID] int NOT NULL IDENTITY,
    [ProductName] nvarchar(200) NOT NULL,
    [CategoryID] int NOT NULL,
    [Unit] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([ProductID]),
    CONSTRAINT [FK_Products_Categories] FOREIGN KEY ([CategoryID]) REFERENCES [Categories] ([CategoryID])
);
GO

CREATE TABLE [RescueTeams] (
    [TeamID] int NOT NULL IDENTITY,
    [TeamName] nvarchar(200) NOT NULL,
    [StatusID] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [IsActive] bit NOT NULL,
    [AssemblyLocationText] nvarchar(500) NULL,
    [AssemblyLatitude] float NULL,
    [AssemblyLongitude] float NULL,
    [AssemblyNote] nvarchar(500) NULL,
    CONSTRAINT [PK_RescueTeams] PRIMARY KEY ([TeamID]),
    CONSTRAINT [FK_RescueTeams_RescueTeamsStatus] FOREIGN KEY ([StatusID]) REFERENCES [RescueTeamsStatus] ([RescueTeamsStatusID])
);
GO

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
    CONSTRAINT [FK_Users_Roles] FOREIGN KEY ([RoleID]) REFERENCES [Roles] ([RoleID])
);
GO

CREATE TABLE [Vehicles] (
    [VehicleID] int NOT NULL IDENTITY,
    [VehicleCode] nvarchar(50) NOT NULL,
    [VehicleType] int NOT NULL,
    [Capacity] int NULL,
    [StatusID] int NOT NULL,
    [Note] nvarchar(500) NULL,
    CONSTRAINT [PK_Vehicles] PRIMARY KEY ([VehicleID]),
    CONSTRAINT [FK_Vehicles_VehiclesStatus] FOREIGN KEY ([StatusID]) REFERENCES [VehiclesStatus] ([VehiclesStatusID]),
    CONSTRAINT [FK_Vehicles_VehiclesTypes] FOREIGN KEY ([VehicleType]) REFERENCES [VehiclesTypes] ([VehicleTypeID])
);
GO

CREATE TABLE [WarehouseStock] (
    [WarehouseID] int NOT NULL,
    [ProductID] int NOT NULL,
    [CurrentQuantity] decimal(18,2) NOT NULL,
    [LastUpdated] datetime2 NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_WarehouseStock] PRIMARY KEY ([WarehouseID], [ProductID]),
    CONSTRAINT [FK_Stock_Products] FOREIGN KEY ([ProductID]) REFERENCES [Products] ([ProductID]),
    CONSTRAINT [FK_Stock_Warehouses] FOREIGN KEY ([WarehouseID]) REFERENCES [Warehouses] ([WarehouseID])
);
GO

CREATE TABLE [RefreshToken] (
    [RefreshTokenId] int NOT NULL IDENTITY,
    [UserID] int NULL,
    [Token] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ExpiredAt] datetime2 NOT NULL,
    [Revoked] bit NOT NULL,
    [IPAddress] nvarchar(255) NULL,
    [UserAgent] nvarchar(max) NULL,
    CONSTRAINT [PK__RefreshT__F5845E392455FC9A] PRIMARY KEY ([RefreshTokenId]),
    CONSTRAINT [FK__RefreshTo__UserI__2D27B809] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE
);
GO

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
GO

CREATE TABLE [RescueTeamMembers] (
    [MemberID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [TeamID] int NOT NULL,
    [RoleID] int NOT NULL,
    [AssignedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [AssignedByUserID] int NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_RescueTeamMembers] PRIMARY KEY ([MemberID]),
    CONSTRAINT [FK_RescueTeamMembers_AssignedByUser] FOREIGN KEY ([AssignedByUserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_RescueTeamMembers_RescueMembersRoles] FOREIGN KEY ([RoleID]) REFERENCES [RescueMembersRoles] ([RescueMembersRoleID]),
    CONSTRAINT [FK_RescueTeamMembers_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_TeamMembers_Team] FOREIGN KEY ([TeamID]) REFERENCES [RescueTeams] ([TeamID]) ON DELETE CASCADE
);
GO

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
GO

CREATE TABLE [VolunteerProfiles] (
    [VolunteerProfileID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [ApplicationStatus] int NOT NULL,
    [ApprovedByManagerId] int NULL,
    [ApprovedAt] datetime2 NULL,
    [RejectedReason] nvarchar(500) NULL,
    [IsAvailable] bit NOT NULL DEFAULT CAST(1 AS bit),
    [Notes] nvarchar(1000) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    [UpdatedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_VolunteerProfiles] PRIMARY KEY ([VolunteerProfileID]),
    CONSTRAINT [FK_VolunteerProfiles_Managers] FOREIGN KEY ([ApprovedByManagerId]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_VolunteerProfiles_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE
);
GO

CREATE TABLE [AttachmentRescue] (
    [AttachmentID] uniqueidentifier NOT NULL,
    [RescueRequestID] int NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_RescueRequestAttachments] PRIMARY KEY ([AttachmentID]),
    CONSTRAINT [FK_AttachmentRescue_RescueRequests] FOREIGN KEY ([RescueRequestID]) REFERENCES [RescueRequests] ([RescueRequestID]) ON DELETE CASCADE
);
GO

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
GO

CREATE TABLE [RescueRequestLogs] (
    [LogID] bigint NOT NULL IDENTITY,
    [RescueRequestID] int NOT NULL,
    [OldRescueRequests] nvarchar(2000) NULL,
    [ChangedByUserID] int NULL,
    [ChangedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_RescueRequestLog] PRIMARY KEY ([LogID], [RescueRequestID]),
    CONSTRAINT [FK_ReqStatusHistory_RescueRequests] FOREIGN KEY ([RescueRequestID]) REFERENCES [RescueRequests] ([RescueRequestID]) ON DELETE CASCADE
);
GO

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
GO

CREATE TABLE [VolunteerSkills] (
    [VolunteerSkillID] int NOT NULL IDENTITY,
    [UserID] int NOT NULL,
    [SkillTypeID] int NOT NULL,
    [VolunteerProfileId] int NULL,
    CONSTRAINT [PK_VolunteerSkills] PRIMARY KEY ([VolunteerSkillID]),
    CONSTRAINT [FK_VolunteerSkills_SkillTypes] FOREIGN KEY ([SkillTypeID]) REFERENCES [VolunteerSkillTypes] ([SkillTypeID]) ON DELETE CASCADE,
    CONSTRAINT [FK_VolunteerSkills_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID]) ON DELETE CASCADE,
    CONSTRAINT [FK_VolunteerSkills_VolunteerProfiles_VolunteerProfileId] FOREIGN KEY ([VolunteerProfileId]) REFERENCES [VolunteerProfiles] ([VolunteerProfileID])
);
GO

CREATE TABLE [AttachmentMission] (
    [AttachmentID] uniqueidentifier NOT NULL,
    [MissionID] int NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(50) NOT NULL,
    CONSTRAINT [PK_AttachmentMission] PRIMARY KEY ([AttachmentID]),
    CONSTRAINT [FK_AttachmentMission_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID]) ON DELETE CASCADE
);
GO

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
GO

CREATE TABLE [MissionLogs] (
    [LogID] bigint NOT NULL IDENTITY,
    [MissionID] int NOT NULL,
    [OldRescueMissions] nvarchar(2000) NULL,
    [ChangedByUserID] int NOT NULL,
    [ChangedAt] datetime2 NOT NULL DEFAULT ((sysutcdatetime())),
    CONSTRAINT [PK_MissionLogs] PRIMARY KEY ([LogID], [MissionID]),
    CONSTRAINT [FK_MissionLogs_RescueMissions] FOREIGN KEY ([MissionID]) REFERENCES [RescueMissions] ([MissionID]) ON DELETE CASCADE
);
GO

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

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'RoleID', N'RoleName') AND [object_id] = OBJECT_ID(N'[Roles]'))
    SET IDENTITY_INSERT [Roles] ON;
INSERT INTO [Roles] ([RoleID], [RoleName])
VALUES (4, N'Volunteer');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'RoleID', N'RoleName') AND [object_id] = OBJECT_ID(N'[Roles]'))
    SET IDENTITY_INSERT [Roles] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'OfferTypeID', N'IsTypicallyReturnable', N'TypeName') AND [object_id] = OBJECT_ID(N'[VolunteerOfferTypes]'))
    SET IDENTITY_INSERT [VolunteerOfferTypes] ON;
INSERT INTO [VolunteerOfferTypes] ([OfferTypeID], [IsTypicallyReturnable], [TypeName])
VALUES (1, CAST(0 AS bit), N'Food'),
(2, CAST(1 AS bit), N'LifeJacket'),
(3, CAST(1 AS bit), N'Boat'),
(4, CAST(0 AS bit), N'MedicalSupplies'),
(5, CAST(1 AS bit), N'RescueEquipment'),
(6, CAST(0 AS bit), N'Other');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'OfferTypeID', N'IsTypicallyReturnable', N'TypeName') AND [object_id] = OBJECT_ID(N'[VolunteerOfferTypes]'))
    SET IDENTITY_INSERT [VolunteerOfferTypes] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'SkillTypeID', N'SkillName') AND [object_id] = OBJECT_ID(N'[VolunteerSkillTypes]'))
    SET IDENTITY_INSERT [VolunteerSkillTypes] ON;
INSERT INTO [VolunteerSkillTypes] ([SkillTypeID], [SkillName])
VALUES (1, N'MedicalSupport'),
(2, N'DirectRescuer'),
(3, N'LogisticsSupport'),
(4, N'BoatOperator');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'SkillTypeID', N'SkillName') AND [object_id] = OBJECT_ID(N'[VolunteerSkillTypes]'))
    SET IDENTITY_INSERT [VolunteerSkillTypes] OFF;
GO

CREATE INDEX [IX_AttachmentMission_MissionID] ON [AttachmentMission] ([MissionID]);
GO

CREATE INDEX [IX_AttachmentRescue_RescueRequestID] ON [AttachmentRescue] ([RescueRequestID]);
GO

CREATE UNIQUE INDEX [UQ__Categori__8517B2E0DB728485] ON [Categories] ([CategoryName]);
GO

CREATE INDEX [IX_InventoryTransactions_MissionID] ON [InventoryTransactions] ([MissionID]);
GO

CREATE INDEX [IX_InventoryTransactions_WarehouseID_ProductID] ON [InventoryTransactions] ([WarehouseID], [ProductID]);
GO

CREATE INDEX [IX_MissionLogs_MissionID] ON [MissionLogs] ([MissionID]);
GO

CREATE INDEX [IX_Products_CategoryID] ON [Products] ([CategoryID]);
GO

CREATE INDEX [IX_RefreshToken_UserID] ON [RefreshToken] ([UserID]);
GO

CREATE UNIQUE INDEX [UQ__RefreshT__1EB4F8175D3536C7] ON [RefreshToken] ([Token]) WHERE [Token] IS NOT NULL;
GO

CREATE UNIQUE INDEX [UQ_RescueMembersRoles_RollName] ON [RescueMembersRoles] ([RoleName]);
GO

CREATE INDEX [IX_RescueMissions_CoordinatorUserID] ON [RescueMissions] ([CoordinatorUserID]);
GO

CREATE INDEX [IX_RescueMissions_RescueRequestID] ON [RescueMissions] ([RescueRequestID]);
GO

CREATE INDEX [IX_RescueMissions_StatusID] ON [RescueMissions] ([StatusID]);
GO

CREATE UNIQUE INDEX [UQ_RescueMissionsStatus_StatusName] ON [RescueMissionsStatus] ([StatusName]);
GO

CREATE INDEX [IX_RescueRequestLogs_RescueRequestID] ON [RescueRequestLogs] ([RescueRequestID]);
GO

CREATE INDEX [IX_RescueRequests_RequestType] ON [RescueRequests] ([RequestType]);
GO

CREATE INDEX [IX_RescueRequests_Status] ON [RescueRequests] ([Status]);
GO

CREATE INDEX [IX_RescueRequests_UrgencyLevel] ON [RescueRequests] ([UrgencyLevel]);
GO

CREATE INDEX [IX_RescueRequests_UserReqID] ON [RescueRequests] ([UserReqID]);
GO

CREATE INDEX [IX_RescueTeamMembers_AssignedByUserID] ON [RescueTeamMembers] ([AssignedByUserID]);
GO

CREATE INDEX [IX_RescueTeamMembers_RoleID] ON [RescueTeamMembers] ([RoleID]);
GO

CREATE INDEX [IX_RescueTeamMembers_TeamID] ON [RescueTeamMembers] ([TeamID]);
GO

CREATE INDEX [UQ_RescueTeamMembers_User_Team] ON [RescueTeamMembers] ([UserID], [TeamID]);
GO

CREATE INDEX [IX_RescueTeams_StatusID] ON [RescueTeams] ([StatusID]);
GO

CREATE UNIQUE INDEX [UQ_Roles_RoleName] ON [Roles] ([RoleName]);
GO

CREATE INDEX [IX_Users_RoleID] ON [Users] ([RoleID]);
GO

CREATE UNIQUE INDEX [UQ_Users_Email] ON [Users] ([Email]);
GO

CREATE INDEX [IX_VehicleAssignments_VehicleID] ON [VehicleAssignments] ([VehicleID]);
GO

CREATE INDEX [IX_Vehicles_StatusID] ON [Vehicles] ([StatusID]);
GO

CREATE INDEX [IX_Vehicles_VehicleType] ON [Vehicles] ([VehicleType]);
GO

CREATE UNIQUE INDEX [UQ_Vehicles_VehicleCode] ON [Vehicles] ([VehicleCode]);
GO

CREATE INDEX [IX_VolunteerOfferAssignments_AssignedByManagerID] ON [VolunteerOfferAssignments] ([AssignedByManagerID]);
GO

CREATE INDEX [IX_VolunteerOfferAssignments_OfferID] ON [VolunteerOfferAssignments] ([OfferID]);
GO

CREATE INDEX [IX_VolunteerOfferAssignments_TeamID] ON [VolunteerOfferAssignments] ([TeamID]);
GO

CREATE INDEX [IX_VolunteerOffers_OfferTypeID] ON [VolunteerOffers] ([OfferTypeID]);
GO

CREATE INDEX [IX_VolunteerOffers_UserID] ON [VolunteerOffers] ([UserID]);
GO

CREATE UNIQUE INDEX [UQ_VolunteerOfferTypes_TypeName] ON [VolunteerOfferTypes] ([TypeName]);
GO

CREATE INDEX [IX_VolunteerProfiles_ApprovedByManagerId] ON [VolunteerProfiles] ([ApprovedByManagerId]);
GO

CREATE UNIQUE INDEX [IX_VolunteerProfiles_UserID] ON [VolunteerProfiles] ([UserID]);
GO

CREATE INDEX [IX_VolunteerSkills_SkillTypeID] ON [VolunteerSkills] ([SkillTypeID]);
GO

CREATE INDEX [IX_VolunteerSkills_VolunteerProfileId] ON [VolunteerSkills] ([VolunteerProfileId]);
GO

CREATE UNIQUE INDEX [UQ_VolunteerSkills_User_Skill] ON [VolunteerSkills] ([UserID], [SkillTypeID]);
GO

CREATE UNIQUE INDEX [UQ_VolunteerSkillTypes_SkillName] ON [VolunteerSkillTypes] ([SkillName]);
GO

CREATE INDEX [IX_WarehouseStock_ProductID] ON [WarehouseStock] ([ProductID]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260323182636_AddVolunteerManagement', N'8.0.25');
GO

COMMIT;
GO

