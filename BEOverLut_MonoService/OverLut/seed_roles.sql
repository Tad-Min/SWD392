USE [OverlutDb];
GO
IF NOT EXISTS (SELECT * FROM [RescueMembersRoles] WHERE [RescueMembersRoleID] = 2)
    INSERT INTO [RescueMembersRoles] ([RescueMembersRoleID], [RoleName]) VALUES (2, N'Cứu trợ y tế');
IF NOT EXISTS (SELECT * FROM [RescueMembersRoles] WHERE [RescueMembersRoleID] = 3)
    INSERT INTO [RescueMembersRoles] ([RescueMembersRoleID], [RoleName]) VALUES (3, N'Logistic');
IF NOT EXISTS (SELECT * FROM [RescueMembersRoles] WHERE [RescueMembersRoleID] = 4)
    INSERT INTO [RescueMembersRoles] ([RescueMembersRoleID], [RoleName]) VALUES (4, N'Cứu trợ trực tiếp');
GO
