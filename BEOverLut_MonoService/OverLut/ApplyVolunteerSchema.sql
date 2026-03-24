-- Update Roles
IF NOT EXISTS (SELECT * FROM [Roles] WHERE [RoleID] = 6)
BEGIN
    INSERT INTO [Roles] ([RoleID], [RoleName]) VALUES (6, N'Volunteer');
END
GO

-- Update RescueTeams
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[RescueTeams]') AND name = 'AssemblyLocationText')
BEGIN
    ALTER TABLE [RescueTeams] ADD [AssemblyLocationText] nvarchar(500) NULL;
    ALTER TABLE [RescueTeams] ADD [AssemblyLatitude] float NULL;
    ALTER TABLE [RescueTeams] ADD [AssemblyLongitude] float NULL;
    ALTER TABLE [RescueTeams] ADD [AssemblyNote] nvarchar(500) NULL;
END
GO

-- Recreate RescueTeamMembers since PK changed from UserID to MemberID
IF OBJECT_ID('FK_RescueTeamMembers_AssignedByUser', 'F') IS NOT NULL
    ALTER TABLE [RescueTeamMembers] DROP CONSTRAINT [FK_RescueTeamMembers_AssignedByUser];
IF OBJECT_ID('FK_RescueTeamMembers_RescueMembersRoles', 'F') IS NOT NULL
    ALTER TABLE [RescueTeamMembers] DROP CONSTRAINT [FK_RescueTeamMembers_RescueMembersRoles];
IF OBJECT_ID('FK_RescueTeamMembers_Users', 'F') IS NOT NULL
    ALTER TABLE [RescueTeamMembers] DROP CONSTRAINT [FK_RescueTeamMembers_Users];
IF OBJECT_ID('FK_TeamMembers_Team', 'F') IS NOT NULL
    ALTER TABLE [RescueTeamMembers] DROP CONSTRAINT [FK_TeamMembers_Team];
IF OBJECT_ID('PK_RescueTeamMembers', 'K') IS NOT NULL
    ALTER TABLE [RescueTeamMembers] DROP CONSTRAINT [PK_RescueTeamMembers];
GO

IF OBJECT_ID('RescueTeamMembers', 'U') IS NOT NULL
    DROP TABLE [RescueTeamMembers];
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
CREATE INDEX [IX_RescueTeamMembers_AssignedByUserID] ON [RescueTeamMembers] ([AssignedByUserID]);
CREATE INDEX [IX_RescueTeamMembers_RoleID] ON [RescueTeamMembers] ([RoleID]);
CREATE INDEX [IX_RescueTeamMembers_TeamID] ON [RescueTeamMembers] ([TeamID]);
CREATE INDEX [UQ_RescueTeamMembers_User_Team] ON [RescueTeamMembers] ([UserID], [TeamID]);
GO

-- VolunteerOfferTypes
IF OBJECT_ID('VolunteerOfferTypes', 'U') IS NULL
BEGIN
    CREATE TABLE [VolunteerOfferTypes] (
        [OfferTypeID] int NOT NULL IDENTITY,
        [TypeName] nvarchar(100) NOT NULL,
        [IsTypicallyReturnable] bit NOT NULL,
        CONSTRAINT [PK_VolunteerOfferTypes] PRIMARY KEY ([OfferTypeID])
    );
    CREATE UNIQUE INDEX [UQ_VolunteerOfferTypes_TypeName] ON [VolunteerOfferTypes] ([TypeName]);
    
    SET IDENTITY_INSERT [VolunteerOfferTypes] ON;
    INSERT INTO [VolunteerOfferTypes] ([OfferTypeID], [IsTypicallyReturnable], [TypeName])
    VALUES (1, CAST(0 AS bit), N'Food'),
    (2, CAST(1 AS bit), N'LifeJacket'),
    (3, CAST(1 AS bit), N'Boat'),
    (4, CAST(0 AS bit), N'MedicalSupplies'),
    (5, CAST(1 AS bit), N'RescueEquipment'),
    (6, CAST(0 AS bit), N'Other');
    SET IDENTITY_INSERT [VolunteerOfferTypes] OFF;
END
GO

-- VolunteerSkillTypes
IF OBJECT_ID('VolunteerSkillTypes', 'U') IS NULL
BEGIN
    CREATE TABLE [VolunteerSkillTypes] (
        [SkillTypeID] int NOT NULL IDENTITY,
        [SkillName] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_VolunteerSkillTypes] PRIMARY KEY ([SkillTypeID])
    );
    CREATE UNIQUE INDEX [UQ_VolunteerSkillTypes_SkillName] ON [VolunteerSkillTypes] ([SkillName]);

    SET IDENTITY_INSERT [VolunteerSkillTypes] ON;
    INSERT INTO [VolunteerSkillTypes] ([SkillTypeID], [SkillName])
    VALUES (1, N'MedicalSupport'),
    (2, N'DirectRescuer'),
    (3, N'LogisticsSupport'),
    (4, N'BoatOperator');
    SET IDENTITY_INSERT [VolunteerSkillTypes] OFF;
END
GO

-- VolunteerOffers
IF OBJECT_ID('VolunteerOffers', 'U') IS NULL
BEGIN
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
    CREATE INDEX [IX_VolunteerOffers_OfferTypeID] ON [VolunteerOffers] ([OfferTypeID]);
    CREATE INDEX [IX_VolunteerOffers_UserID] ON [VolunteerOffers] ([UserID]);
END
GO

-- VolunteerProfiles
IF OBJECT_ID('VolunteerProfiles', 'U') IS NULL
BEGIN
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
    CREATE INDEX [IX_VolunteerProfiles_ApprovedByManagerId] ON [VolunteerProfiles] ([ApprovedByManagerId]);
    CREATE UNIQUE INDEX [IX_VolunteerProfiles_UserID] ON [VolunteerProfiles] ([UserID]);
END
GO

-- VolunteerOfferAssignments
IF OBJECT_ID('VolunteerOfferAssignments', 'U') IS NULL
BEGIN
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
    CREATE INDEX [IX_VolunteerOfferAssignments_AssignedByManagerID] ON [VolunteerOfferAssignments] ([AssignedByManagerID]);
    CREATE INDEX [IX_VolunteerOfferAssignments_OfferID] ON [VolunteerOfferAssignments] ([OfferID]);
    CREATE INDEX [IX_VolunteerOfferAssignments_TeamID] ON [VolunteerOfferAssignments] ([TeamID]);
END
GO

-- VolunteerSkills
IF OBJECT_ID('VolunteerSkills', 'U') IS NULL
BEGIN
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
    CREATE INDEX [IX_VolunteerSkills_SkillTypeID] ON [VolunteerSkills] ([SkillTypeID]);
    CREATE INDEX [IX_VolunteerSkills_VolunteerProfileId] ON [VolunteerSkills] ([VolunteerProfileId]);
    CREATE UNIQUE INDEX [UQ_VolunteerSkills_User_Skill] ON [VolunteerSkills] ([UserID], [SkillTypeID]);
END
GO
