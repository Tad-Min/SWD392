BEGIN TRANSACTION;
GO

ALTER TABLE [RescueTeams] ADD [RoleID] int NULL;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'RoleID', N'RoleName') AND [object_id] = OBJECT_ID(N'[Roles]'))
    SET IDENTITY_INSERT [Roles] ON;
INSERT INTO [Roles] ([RoleID], [RoleName])
VALUES (6, N'Volunteer');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'RoleID', N'RoleName') AND [object_id] = OBJECT_ID(N'[Roles]'))
    SET IDENTITY_INSERT [Roles] OFF;
GO

CREATE INDEX [IX_RescueTeams_RoleID] ON [RescueTeams] ([RoleID]);
GO

ALTER TABLE [RescueTeams] ADD CONSTRAINT [FK_RescueTeams_RescueMembersRoles] FOREIGN KEY ([RoleID]) REFERENCES [RescueMembersRoles] ([RescueMembersRoleID]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260324133216_AddRoleIdToRescueTeam', N'8.0.25');
GO

COMMIT;
GO

