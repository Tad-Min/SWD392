using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DAOs;

public partial class OverlutDbContext : DbContext
{
    public OverlutDbContext()
    {
    }

    public OverlutDbContext(DbContextOptions<OverlutDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AttachmentMission> AttachmentMissions { get; set; }

    public virtual DbSet<AttachmentRescue> AttachmentRescues { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<InventoryTransaction> InventoryTransactions { get; set; }

    public virtual DbSet<MissionLog> MissionLogs { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<RescueMembersRole> RescueMembersRoles { get; set; }

    public virtual DbSet<RescueMission> RescueMissions { get; set; }

    public virtual DbSet<RescueMissionsStatus> RescueMissionsStatuses { get; set; }

    public virtual DbSet<RescueRequest> RescueRequests { get; set; }

    public virtual DbSet<RescueRequestLog> RescueRequestLogs { get; set; }

    public virtual DbSet<RescueRequestsStatus> RescueRequestsStatuses { get; set; }

    public virtual DbSet<RescueRequestsType> RescueRequestsTypes { get; set; }

    public virtual DbSet<RescueTeam> RescueTeams { get; set; }

    public virtual DbSet<RescueTeamMember> RescueTeamMembers { get; set; }

    public virtual DbSet<RescueTeamsStatus> RescueTeamsStatuses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<UrgencyLevel> UrgencyLevels { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehicleAssignment> VehicleAssignments { get; set; }

    public virtual DbSet<VehiclesStatus> VehiclesStatuses { get; set; }

    public virtual DbSet<VehiclesType> VehiclesTypes { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    public virtual DbSet<WarehouseStock> WarehouseStocks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("overlutdb");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AttachmentMission>(entity =>
        {
            entity.HasKey(e => e.AttachmentId);

            entity.ToTable("AttachmentMission");

            entity.Property(e => e.AttachmentId)
                .ValueGeneratedNever()
                .HasColumnName("AttachmentID");
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.MissionId).HasColumnName("MissionID");

            entity.HasOne(d => d.Mission).WithMany(p => p.AttachmentMissions)
                .HasForeignKey(d => d.MissionId)
                .HasConstraintName("FK_AttachmentMission_RescueMissions");
        });

        modelBuilder.Entity<AttachmentRescue>(entity =>
        {
            entity.HasKey(e => e.AttachmentId).HasName("PK_RescueRequestAttachments");

            entity.ToTable("AttachmentRescue");

            entity.Property(e => e.AttachmentId)
                .ValueGeneratedNever()
                .HasColumnName("AttachmentID");
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.AttachmentRescues)
                .HasForeignKey(d => d.RescueRequestId)
                .HasConstraintName("FK_AttachmentRescue_RescueRequests");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(e => e.CategoryName, "UQ__Categori__8517B2E0B552B2EA").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(100);
        });

        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.HasKey(e => e.TxId);

            entity.Property(e => e.TxId).HasColumnName("TxID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CreatedByUserId).HasColumnName("CreatedByUserID");
            entity.Property(e => e.MissionId).HasColumnName("MissionID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.Mission).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => d.MissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InventoryTransactions_RescueMissions");

            entity.HasOne(d => d.WarehouseStock).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => new { d.WarehouseId, d.ProductId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InventoryTransactions_Products");
        });

        modelBuilder.Entity<MissionLog>(entity =>
        {
            entity.HasKey(e => new { e.LogId, e.MissionId });

            entity.Property(e => e.LogId)
                .ValueGeneratedOnAdd()
                .HasColumnName("LogID");
            entity.Property(e => e.MissionId).HasColumnName("MissionID");
            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ChangedByUserId).HasColumnName("ChangedByUserID");
            entity.Property(e => e.OldRescueMissions).HasMaxLength(2000);

            entity.HasOne(d => d.Mission).WithMany(p => p.MissionLogs)
                .HasForeignKey(d => d.MissionId)
                .HasConstraintName("FK_MissionLogs_RescueMissions");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.ProductName).HasMaxLength(200);
            entity.Property(e => e.Unit).HasMaxLength(50);

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Products_Categories");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E393622578C");

            entity.ToTable("RefreshToken");

            entity.HasIndex(e => e.Token, "UQ__RefreshT__1EB4F81753A2E03D").IsUnique();

            entity.Property(e => e.Ipaddress)
                .HasMaxLength(255)
                .HasColumnName("IPAddress");
            entity.Property(e => e.Token).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RefreshTo__UserI__2D27B809");
        });

        modelBuilder.Entity<RescueMembersRole>(entity =>
        {
            entity.HasIndex(e => e.RollName, "UQ_RescueMembersRoles_RollName").IsUnique();

            entity.Property(e => e.RescueMembersRoleId)
                .ValueGeneratedNever()
                .HasColumnName("RescueMembersRoleID");
            entity.Property(e => e.RollName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueMission>(entity =>
        {
            entity.HasKey(e => e.MissionId);

            entity.Property(e => e.MissionId).HasColumnName("MissionID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CoordinatorUserId).HasColumnName("CoordinatorUserID");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.CoordinatorUser).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.CoordinatorUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueMissions_Users");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.RescueRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueMissions_RescueRequests");

            entity.HasOne(d => d.Status).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueMissions_RescueMissionsStatus");
        });

        modelBuilder.Entity<RescueMissionsStatus>(entity =>
        {
            entity.ToTable("RescueMissionsStatus");

            entity.HasIndex(e => e.StatusName, "UQ_RescueMissionsStatus_StatusName").IsUnique();

            entity.Property(e => e.RescueMissionsStatusId).HasColumnName("RescueMissionsStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueRequest>(entity =>
        {
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(50)
                .HasColumnName("IPAddress");
            entity.Property(e => e.LocationText).HasMaxLength(500);
            entity.Property(e => e.PeopleCount).HasDefaultValue(1);
            entity.Property(e => e.UserReqId).HasColumnName("UserReqID");

            entity.HasOne(d => d.RequestTypeNavigation).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.RequestType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueRequests_RescueRequestsTypes");

            entity.HasOne(d => d.StatusNavigation).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.Status)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueRequests_RescueRequestsStatus");

            entity.HasOne(d => d.UrgencyLevelNavigation).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.UrgencyLevel)
                .HasConstraintName("FK_RescueRequests_UrgencyLevels");

            entity.HasOne(d => d.UserReq).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.UserReqId)
                .HasConstraintName("FK_RescueRequests_UserReqID");
        });

        modelBuilder.Entity<RescueRequestLog>(entity =>
        {
            entity.HasKey(e => new { e.LogId, e.RescueRequestId }).HasName("PK_RescueRequestLog");

            entity.Property(e => e.LogId)
                .ValueGeneratedOnAdd()
                .HasColumnName("LogID");
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");
            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ChangedByUserId).HasColumnName("ChangedByUserID");
            entity.Property(e => e.OldRescueRequests).HasMaxLength(2000);

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.RescueRequestLogs)
                .HasForeignKey(d => d.RescueRequestId)
                .HasConstraintName("FK_ReqStatusHistory_RescueRequests");
        });

        modelBuilder.Entity<RescueRequestsStatus>(entity =>
        {
            entity.ToTable("RescueRequestsStatus");

            entity.Property(e => e.RescueRequestsStatusId).HasColumnName("RescueRequestsStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueRequestsType>(entity =>
        {
            entity.Property(e => e.RescueRequestsTypeId).HasColumnName("RescueRequestsTypeID");
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueTeam>(entity =>
        {
            entity.HasKey(e => e.TeamId);

            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.TeamName).HasMaxLength(200);

            entity.HasOne(d => d.Status).WithMany(p => p.RescueTeams)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueTeams_RescueTeamsStatus");
        });

        modelBuilder.Entity<RescueTeamMember>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("UserID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.Role).WithMany(p => p.RescueTeamMembers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueTeamMembers_RescueMembersRoles");

            entity.HasOne(d => d.Team).WithMany(p => p.RescueTeamMembers)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_TeamMembers_Team");

            entity.HasOne(d => d.User).WithOne(p => p.RescueTeamMember)
                .HasForeignKey<RescueTeamMember>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueTeamMembers_Users");
        });

        modelBuilder.Entity<RescueTeamsStatus>(entity =>
        {
            entity.ToTable("RescueTeamsStatus");

            entity.Property(e => e.RescueTeamsStatusId).HasColumnName("RescueTeamsStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(e => e.RoleName, "UQ_Roles_RoleName").IsUnique();

            entity.Property(e => e.RoleId)
                .ValueGeneratedNever()
                .HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(255);
        });

        modelBuilder.Entity<UrgencyLevel>(entity =>
        {
            entity.HasKey(e => e.UrgencyLevelId).HasName("PK_UrgencyLevel");

            entity.Property(e => e.UrgencyLevelId).HasColumnName("UrgencyLevelID");
            entity.Property(e => e.UrgencyName).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email, "UQ_Users_Email").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.IdentifyId)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("IdentifyID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Password).HasMaxLength(100);
            entity.Property(e => e.Phone)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Roles");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasIndex(e => e.VehicleCode, "UQ_Vehicles_VehicleCode").IsUnique();

            entity.Property(e => e.VehicleId).HasColumnName("VehicleID");
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.VehicleCode).HasMaxLength(50);

            entity.HasOne(d => d.Status).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vehicles_VehiclesStatus");

            entity.HasOne(d => d.VehicleTypeNavigation).WithMany(p => p.Vehicles)
                .HasForeignKey(d => d.VehicleType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Vehicles_VehiclesTypes");
        });

        modelBuilder.Entity<VehicleAssignment>(entity =>
        {
            entity.HasKey(e => new { e.MissionId, e.VehicleId });

            entity.Property(e => e.MissionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("MissionID");
            entity.Property(e => e.VehicleId).HasColumnName("VehicleID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Mission).WithMany(p => p.VehicleAssignments)
                .HasForeignKey(d => d.MissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleAssignments_RescueMissions");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.VehicleAssignments)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleAssignments_Vehicle");
        });

        modelBuilder.Entity<VehiclesStatus>(entity =>
        {
            entity.ToTable("VehiclesStatus");

            entity.Property(e => e.VehiclesStatusId).HasColumnName("VehiclesStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<VehiclesType>(entity =>
        {
            entity.HasKey(e => e.VehicleTypeId);

            entity.Property(e => e.VehicleTypeId).HasColumnName("VehicleTypeID");
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.LocationText).HasMaxLength(500);
            entity.Property(e => e.WarehouseName).HasMaxLength(200);
        });

        modelBuilder.Entity<WarehouseStock>(entity =>
        {
            entity.HasKey(e => new { e.WarehouseId, e.ProductId });

            entity.ToTable("WarehouseStock");

            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.CurrentQuantity).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LastUpdated).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Product).WithMany(p => p.WarehouseStocks)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Stock_Products");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.WarehouseStocks)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Stock_Warehouses");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
