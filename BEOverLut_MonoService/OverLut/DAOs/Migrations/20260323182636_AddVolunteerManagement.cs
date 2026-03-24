using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DAOs.Migrations
{
    /// <inheritdoc />
    public partial class AddVolunteerManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "RescueMembersRoles",
                columns: table => new
                {
                    RescueMembersRoleID = table.Column<int>(type: "int", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueMembersRoles", x => x.RescueMembersRoleID);
                });

            migrationBuilder.CreateTable(
                name: "RescueMissionsStatus",
                columns: table => new
                {
                    RescueMissionsStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueMissionsStatus", x => x.RescueMissionsStatusID);
                });

            migrationBuilder.CreateTable(
                name: "RescueRequestsStatus",
                columns: table => new
                {
                    RescueRequestsStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueRequestsStatus", x => x.RescueRequestsStatusID);
                });

            migrationBuilder.CreateTable(
                name: "RescueRequestsTypes",
                columns: table => new
                {
                    RescueRequestsTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueRequestsTypes", x => x.RescueRequestsTypeID);
                });

            migrationBuilder.CreateTable(
                name: "RescueTeamsStatus",
                columns: table => new
                {
                    RescueTeamsStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueTeamsStatus", x => x.RescueTeamsStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "UrgencyLevels",
                columns: table => new
                {
                    UrgencyLevelID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UrgencyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrgencyLevel", x => x.UrgencyLevelID);
                });

            migrationBuilder.CreateTable(
                name: "VehiclesStatus",
                columns: table => new
                {
                    VehiclesStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StatusName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiclesStatus", x => x.VehiclesStatusID);
                });

            migrationBuilder.CreateTable(
                name: "VehiclesTypes",
                columns: table => new
                {
                    VehicleTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiclesTypes", x => x.VehicleTypeID);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerOfferTypes",
                columns: table => new
                {
                    OfferTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsTypicallyReturnable = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerOfferTypes", x => x.OfferTypeID);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerSkillTypes",
                columns: table => new
                {
                    SkillTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerSkillTypes", x => x.SkillTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Warehouses",
                columns: table => new
                {
                    WarehouseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warehouses", x => x.WarehouseID);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductID);
                    table.ForeignKey(
                        name: "FK_Products_Categories",
                        column: x => x.CategoryID,
                        principalTable: "Categories",
                        principalColumn: "CategoryID");
                });

            migrationBuilder.CreateTable(
                name: "RescueTeams",
                columns: table => new
                {
                    TeamID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeamName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StatusID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AssemblyLocationText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AssemblyLatitude = table.Column<double>(type: "float", nullable: true),
                    AssemblyLongitude = table.Column<double>(type: "float", nullable: true),
                    AssemblyNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueTeams", x => x.TeamID);
                    table.ForeignKey(
                        name: "FK_RescueTeams_RescueTeamsStatus",
                        column: x => x.StatusID,
                        principalTable: "RescueTeamsStatus",
                        principalColumn: "RescueTeamsStatusID");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    IdentifyID = table.Column<string>(type: "varchar(13)", unicode: false, maxLength: 13, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Users_Roles",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    VehicleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VehicleType = table.Column<int>(type: "int", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: true),
                    StatusID = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.VehicleID);
                    table.ForeignKey(
                        name: "FK_Vehicles_VehiclesStatus",
                        column: x => x.StatusID,
                        principalTable: "VehiclesStatus",
                        principalColumn: "VehiclesStatusID");
                    table.ForeignKey(
                        name: "FK_Vehicles_VehiclesTypes",
                        column: x => x.VehicleType,
                        principalTable: "VehiclesTypes",
                        principalColumn: "VehicleTypeID");
                });

            migrationBuilder.CreateTable(
                name: "WarehouseStock",
                columns: table => new
                {
                    WarehouseID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    CurrentQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarehouseStock", x => new { x.WarehouseID, x.ProductID });
                    table.ForeignKey(
                        name: "FK_Stock_Products",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                    table.ForeignKey(
                        name: "FK_Stock_Warehouses",
                        column: x => x.WarehouseID,
                        principalTable: "Warehouses",
                        principalColumn: "WarehouseID");
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    RefreshTokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    Token = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Revoked = table.Column<bool>(type: "bit", nullable: false),
                    IPAddress = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RefreshT__F5845E392455FC9A", x => x.RefreshTokenId);
                    table.ForeignKey(
                        name: "FK__RefreshTo__UserI__2D27B809",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RescueRequests",
                columns: table => new
                {
                    RescueRequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserReqID = table.Column<int>(type: "int", nullable: true),
                    RequestType = table.Column<int>(type: "int", nullable: false),
                    UrgencyLevel = table.Column<int>(type: "int", nullable: true),
                    IPAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PeopleCount = table.Column<int>(type: "int", nullable: true, defaultValue: 1),
                    Location = table.Column<Point>(type: "geography", nullable: true),
                    LocationText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueRequests", x => x.RescueRequestID);
                    table.ForeignKey(
                        name: "FK_RescueRequests_RescueRequestsStatus",
                        column: x => x.Status,
                        principalTable: "RescueRequestsStatus",
                        principalColumn: "RescueRequestsStatusID");
                    table.ForeignKey(
                        name: "FK_RescueRequests_RescueRequestsTypes",
                        column: x => x.RequestType,
                        principalTable: "RescueRequestsTypes",
                        principalColumn: "RescueRequestsTypeID");
                    table.ForeignKey(
                        name: "FK_RescueRequests_UrgencyLevels",
                        column: x => x.UrgencyLevel,
                        principalTable: "UrgencyLevels",
                        principalColumn: "UrgencyLevelID");
                    table.ForeignKey(
                        name: "FK_RescueRequests_UserReqID",
                        column: x => x.UserReqID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "RescueTeamMembers",
                columns: table => new
                {
                    MemberID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    TeamID = table.Column<int>(type: "int", nullable: false),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    AssignedByUserID = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueTeamMembers", x => x.MemberID);
                    table.ForeignKey(
                        name: "FK_RescueTeamMembers_AssignedByUser",
                        column: x => x.AssignedByUserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK_RescueTeamMembers_RescueMembersRoles",
                        column: x => x.RoleID,
                        principalTable: "RescueMembersRoles",
                        principalColumn: "RescueMembersRoleID");
                    table.ForeignKey(
                        name: "FK_RescueTeamMembers_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK_TeamMembers_Team",
                        column: x => x.TeamID,
                        principalTable: "RescueTeams",
                        principalColumn: "TeamID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerOffers",
                columns: table => new
                {
                    OfferID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    OfferTypeID = table.Column<int>(type: "int", nullable: false),
                    OfferName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsReturnRequired = table.Column<bool>(type: "bit", nullable: false),
                    AssetCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CurrentStatus = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    DropoffLocationText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DropoffLatitude = table.Column<double>(type: "float", nullable: true),
                    DropoffLongitude = table.Column<double>(type: "float", nullable: true),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    AvailableFrom = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AvailableTo = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerOffers", x => x.OfferID);
                    table.ForeignKey(
                        name: "FK_VolunteerOffers_OfferTypes",
                        column: x => x.OfferTypeID,
                        principalTable: "VolunteerOfferTypes",
                        principalColumn: "OfferTypeID");
                    table.ForeignKey(
                        name: "FK_VolunteerOffers_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerProfiles",
                columns: table => new
                {
                    VolunteerProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    ApplicationStatus = table.Column<int>(type: "int", nullable: false),
                    ApprovedByManagerId = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectedReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerProfiles", x => x.VolunteerProfileID);
                    table.ForeignKey(
                        name: "FK_VolunteerProfiles_Managers",
                        column: x => x.ApprovedByManagerId,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK_VolunteerProfiles_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AttachmentRescue",
                columns: table => new
                {
                    AttachmentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RescueRequestID = table.Column<int>(type: "int", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueRequestAttachments", x => x.AttachmentID);
                    table.ForeignKey(
                        name: "FK_AttachmentRescue_RescueRequests",
                        column: x => x.RescueRequestID,
                        principalTable: "RescueRequests",
                        principalColumn: "RescueRequestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RescueMissions",
                columns: table => new
                {
                    MissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RescueRequestID = table.Column<int>(type: "int", nullable: false),
                    CoordinatorUserID = table.Column<int>(type: "int", nullable: false),
                    TeamID = table.Column<int>(type: "int", nullable: false),
                    StatusID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueMissions", x => x.MissionID);
                    table.ForeignKey(
                        name: "FK_RescueMissions_RescueMissionsStatus",
                        column: x => x.StatusID,
                        principalTable: "RescueMissionsStatus",
                        principalColumn: "RescueMissionsStatusID");
                    table.ForeignKey(
                        name: "FK_RescueMissions_RescueRequests",
                        column: x => x.RescueRequestID,
                        principalTable: "RescueRequests",
                        principalColumn: "RescueRequestID");
                    table.ForeignKey(
                        name: "FK_RescueMissions_Users",
                        column: x => x.CoordinatorUserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "RescueRequestLogs",
                columns: table => new
                {
                    LogID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RescueRequestID = table.Column<int>(type: "int", nullable: false),
                    OldRescueRequests = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ChangedByUserID = table.Column<int>(type: "int", nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescueRequestLog", x => new { x.LogID, x.RescueRequestID });
                    table.ForeignKey(
                        name: "FK_ReqStatusHistory_RescueRequests",
                        column: x => x.RescueRequestID,
                        principalTable: "RescueRequests",
                        principalColumn: "RescueRequestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VolunteerOfferAssignments",
                columns: table => new
                {
                    OfferAssignmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OfferID = table.Column<int>(type: "int", nullable: false),
                    TeamID = table.Column<int>(type: "int", nullable: true),
                    MissionId = table.Column<int>(type: "int", nullable: true),
                    AssignedByManagerID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    ReceivedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReturnedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReturnConditionNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerOfferAssignments", x => x.OfferAssignmentID);
                    table.ForeignKey(
                        name: "FK_VolunteerOfferAssignments_Managers",
                        column: x => x.AssignedByManagerID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK_VolunteerOfferAssignments_Offers",
                        column: x => x.OfferID,
                        principalTable: "VolunteerOffers",
                        principalColumn: "OfferID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VolunteerOfferAssignments_Teams",
                        column: x => x.TeamID,
                        principalTable: "RescueTeams",
                        principalColumn: "TeamID");
                });

            migrationBuilder.CreateTable(
                name: "VolunteerSkills",
                columns: table => new
                {
                    VolunteerSkillID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    SkillTypeID = table.Column<int>(type: "int", nullable: false),
                    VolunteerProfileId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteerSkills", x => x.VolunteerSkillID);
                    table.ForeignKey(
                        name: "FK_VolunteerSkills_SkillTypes",
                        column: x => x.SkillTypeID,
                        principalTable: "VolunteerSkillTypes",
                        principalColumn: "SkillTypeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VolunteerSkills_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VolunteerSkills_VolunteerProfiles_VolunteerProfileId",
                        column: x => x.VolunteerProfileId,
                        principalTable: "VolunteerProfiles",
                        principalColumn: "VolunteerProfileID");
                });

            migrationBuilder.CreateTable(
                name: "AttachmentMission",
                columns: table => new
                {
                    AttachmentID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MissionID = table.Column<int>(type: "int", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttachmentMission", x => x.AttachmentID);
                    table.ForeignKey(
                        name: "FK_AttachmentMission_RescueMissions",
                        column: x => x.MissionID,
                        principalTable: "RescueMissions",
                        principalColumn: "MissionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryTransactions",
                columns: table => new
                {
                    TxID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WarehouseID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    TxType = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MissionID = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserID = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTransactions", x => x.TxID);
                    table.ForeignKey(
                        name: "FK_InventoryTransactions_Products",
                        columns: x => new { x.WarehouseID, x.ProductID },
                        principalTable: "WarehouseStock",
                        principalColumns: new[] { "WarehouseID", "ProductID" });
                    table.ForeignKey(
                        name: "FK_InventoryTransactions_RescueMissions",
                        column: x => x.MissionID,
                        principalTable: "RescueMissions",
                        principalColumn: "MissionID");
                });

            migrationBuilder.CreateTable(
                name: "MissionLogs",
                columns: table => new
                {
                    LogID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MissionID = table.Column<int>(type: "int", nullable: false),
                    OldRescueMissions = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ChangedByUserID = table.Column<int>(type: "int", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionLogs", x => new { x.LogID, x.MissionID });
                    table.ForeignKey(
                        name: "FK_MissionLogs_RescueMissions",
                        column: x => x.MissionID,
                        principalTable: "RescueMissions",
                        principalColumn: "MissionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleAssignments",
                columns: table => new
                {
                    MissionID = table.Column<int>(type: "int", nullable: false),
                    VehicleID = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(sysutcdatetime())"),
                    ReleasedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleAssignments", x => new { x.MissionID, x.VehicleID });
                    table.ForeignKey(
                        name: "FK_VehicleAssignments_RescueMissions",
                        column: x => x.MissionID,
                        principalTable: "RescueMissions",
                        principalColumn: "MissionID");
                    table.ForeignKey(
                        name: "FK_VehicleAssignments_Vehicle",
                        column: x => x.VehicleID,
                        principalTable: "Vehicles",
                        principalColumn: "VehicleID");
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleID", "RoleName" },
                values: new object[] { 4, "Volunteer" });

            migrationBuilder.InsertData(
                table: "VolunteerOfferTypes",
                columns: new[] { "OfferTypeID", "IsTypicallyReturnable", "TypeName" },
                values: new object[,]
                {
                    { 1, false, "Food" },
                    { 2, true, "LifeJacket" },
                    { 3, true, "Boat" },
                    { 4, false, "MedicalSupplies" },
                    { 5, true, "RescueEquipment" },
                    { 6, false, "Other" }
                });

            migrationBuilder.InsertData(
                table: "VolunteerSkillTypes",
                columns: new[] { "SkillTypeID", "SkillName" },
                values: new object[,]
                {
                    { 1, "MedicalSupport" },
                    { 2, "DirectRescuer" },
                    { 3, "LogisticsSupport" },
                    { 4, "BoatOperator" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttachmentMission_MissionID",
                table: "AttachmentMission",
                column: "MissionID");

            migrationBuilder.CreateIndex(
                name: "IX_AttachmentRescue_RescueRequestID",
                table: "AttachmentRescue",
                column: "RescueRequestID");

            migrationBuilder.CreateIndex(
                name: "UQ__Categori__8517B2E0DB728485",
                table: "Categories",
                column: "CategoryName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_MissionID",
                table: "InventoryTransactions",
                column: "MissionID");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_WarehouseID_ProductID",
                table: "InventoryTransactions",
                columns: new[] { "WarehouseID", "ProductID" });

            migrationBuilder.CreateIndex(
                name: "IX_MissionLogs_MissionID",
                table: "MissionLogs",
                column: "MissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryID",
                table: "Products",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserID",
                table: "RefreshToken",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "UQ__RefreshT__1EB4F8175D3536C7",
                table: "RefreshToken",
                column: "Token",
                unique: true,
                filter: "[Token] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ_RescueMembersRoles_RollName",
                table: "RescueMembersRoles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RescueMissions_CoordinatorUserID",
                table: "RescueMissions",
                column: "CoordinatorUserID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueMissions_RescueRequestID",
                table: "RescueMissions",
                column: "RescueRequestID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueMissions_StatusID",
                table: "RescueMissions",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "UQ_RescueMissionsStatus_StatusName",
                table: "RescueMissionsStatus",
                column: "StatusName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RescueRequestLogs_RescueRequestID",
                table: "RescueRequestLogs",
                column: "RescueRequestID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueRequests_RequestType",
                table: "RescueRequests",
                column: "RequestType");

            migrationBuilder.CreateIndex(
                name: "IX_RescueRequests_Status",
                table: "RescueRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_RescueRequests_UrgencyLevel",
                table: "RescueRequests",
                column: "UrgencyLevel");

            migrationBuilder.CreateIndex(
                name: "IX_RescueRequests_UserReqID",
                table: "RescueRequests",
                column: "UserReqID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueTeamMembers_AssignedByUserID",
                table: "RescueTeamMembers",
                column: "AssignedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueTeamMembers_RoleID",
                table: "RescueTeamMembers",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_RescueTeamMembers_TeamID",
                table: "RescueTeamMembers",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "UQ_RescueTeamMembers_User_Team",
                table: "RescueTeamMembers",
                columns: new[] { "UserID", "TeamID" });

            migrationBuilder.CreateIndex(
                name: "IX_RescueTeams_StatusID",
                table: "RescueTeams",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "UQ_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "UQ_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VehicleAssignments_VehicleID",
                table: "VehicleAssignments",
                column: "VehicleID");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_StatusID",
                table: "Vehicles",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_VehicleType",
                table: "Vehicles",
                column: "VehicleType");

            migrationBuilder.CreateIndex(
                name: "UQ_Vehicles_VehicleCode",
                table: "Vehicles",
                column: "VehicleCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerOfferAssignments_AssignedByManagerID",
                table: "VolunteerOfferAssignments",
                column: "AssignedByManagerID");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerOfferAssignments_OfferID",
                table: "VolunteerOfferAssignments",
                column: "OfferID");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerOfferAssignments_TeamID",
                table: "VolunteerOfferAssignments",
                column: "TeamID");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerOffers_OfferTypeID",
                table: "VolunteerOffers",
                column: "OfferTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerOffers_UserID",
                table: "VolunteerOffers",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "UQ_VolunteerOfferTypes_TypeName",
                table: "VolunteerOfferTypes",
                column: "TypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerProfiles_ApprovedByManagerId",
                table: "VolunteerProfiles",
                column: "ApprovedByManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerProfiles_UserID",
                table: "VolunteerProfiles",
                column: "UserID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerSkills_SkillTypeID",
                table: "VolunteerSkills",
                column: "SkillTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_VolunteerSkills_VolunteerProfileId",
                table: "VolunteerSkills",
                column: "VolunteerProfileId");

            migrationBuilder.CreateIndex(
                name: "UQ_VolunteerSkills_User_Skill",
                table: "VolunteerSkills",
                columns: new[] { "UserID", "SkillTypeID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_VolunteerSkillTypes_SkillName",
                table: "VolunteerSkillTypes",
                column: "SkillName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WarehouseStock_ProductID",
                table: "WarehouseStock",
                column: "ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttachmentMission");

            migrationBuilder.DropTable(
                name: "AttachmentRescue");

            migrationBuilder.DropTable(
                name: "InventoryTransactions");

            migrationBuilder.DropTable(
                name: "MissionLogs");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "RescueRequestLogs");

            migrationBuilder.DropTable(
                name: "RescueTeamMembers");

            migrationBuilder.DropTable(
                name: "VehicleAssignments");

            migrationBuilder.DropTable(
                name: "VolunteerOfferAssignments");

            migrationBuilder.DropTable(
                name: "VolunteerSkills");

            migrationBuilder.DropTable(
                name: "WarehouseStock");

            migrationBuilder.DropTable(
                name: "RescueMembersRoles");

            migrationBuilder.DropTable(
                name: "RescueMissions");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "VolunteerOffers");

            migrationBuilder.DropTable(
                name: "RescueTeams");

            migrationBuilder.DropTable(
                name: "VolunteerSkillTypes");

            migrationBuilder.DropTable(
                name: "VolunteerProfiles");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Warehouses");

            migrationBuilder.DropTable(
                name: "RescueMissionsStatus");

            migrationBuilder.DropTable(
                name: "RescueRequests");

            migrationBuilder.DropTable(
                name: "VehiclesStatus");

            migrationBuilder.DropTable(
                name: "VehiclesTypes");

            migrationBuilder.DropTable(
                name: "VolunteerOfferTypes");

            migrationBuilder.DropTable(
                name: "RescueTeamsStatus");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "RescueRequestsStatus");

            migrationBuilder.DropTable(
                name: "RescueRequestsTypes");

            migrationBuilder.DropTable(
                name: "UrgencyLevels");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
