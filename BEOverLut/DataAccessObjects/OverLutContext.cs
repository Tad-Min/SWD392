using System;
using System.Collections.Generic;
using BusinessObjects;
using Microsoft.EntityFrameworkCore;

namespace DataAccessObjects;

public partial class OverLutContext : DbContext
{
    public OverLutContext()
    {
    }

    public OverLutContext(DbContextOptions<OverLutContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AccessTokenBlacklist> AccessTokenBlacklists { get; set; }

    public virtual DbSet<Channel> Channels { get; set; }

    public virtual DbSet<ChannelMember> ChannelMembers { get; set; }

    public virtual DbSet<InventoryTransaction> InventoryTransactions { get; set; }

    public virtual DbSet<LogLogin> LogLogins { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<MissionUpdate> MissionUpdates { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<ReliefItem> ReliefItems { get; set; }

    public virtual DbSet<RescueMembersRoll> RescueMembersRolls { get; set; }

    public virtual DbSet<RescueMission> RescueMissions { get; set; }

    public virtual DbSet<RescueMissionsStatus> RescueMissionsStatuses { get; set; }

    public virtual DbSet<RescueRequest> RescueRequests { get; set; }

    public virtual DbSet<RescueRequestAttachment> RescueRequestAttachments { get; set; }

    public virtual DbSet<RescueRequestStatusHistory> RescueRequestStatusHistories { get; set; }

    public virtual DbSet<RescueRequestsStatus> RescueRequestsStatuses { get; set; }

    public virtual DbSet<RescueRequestsType> RescueRequestsTypes { get; set; }

    public virtual DbSet<RescueTeam> RescueTeams { get; set; }

    public virtual DbSet<RescueTeamMember> RescueTeamMembers { get; set; }

    public virtual DbSet<RescueTeamsStatus> RescueTeamsStatuses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehicleAssignment> VehicleAssignments { get; set; }

    public virtual DbSet<VehiclesStatus> VehiclesStatuses { get; set; }

    public virtual DbSet<VehiclesType> VehiclesTypes { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(local); Database=OverLut; Uid=sa; Pwd=12345; TrustServerCertificate=True", x => x.UseNetTopologySuite());

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccessTokenBlacklist>(entity =>
        {
            entity.HasKey(e => e.JwtId).HasName("PK__AccessTo__32FE98A2DC5C5CFC");

            entity.ToTable("AccessTokenBlacklist");

            entity.Property(e => e.JwtId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.Reason).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.AccessTokenBlacklists)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__AccessTok__UserI__37A5467C");
        });

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.Property(e => e.ChannelId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("ChannelID");
            entity.Property(e => e.ChannelName).HasMaxLength(255);
            entity.Property(e => e.ChannelType).HasDefaultValue(0);
            entity.Property(e => e.CreateAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DefaultPermissions).HasDefaultValue(1);
        });

        modelBuilder.Entity<ChannelMember>(entity =>
        {
            entity.HasKey(e => new { e.ChannelId, e.UserId });

            entity.Property(e => e.ChannelId).HasColumnName("ChannelID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Permissions).HasDefaultValue(3);

            entity.HasOne(d => d.Channel).WithMany(p => p.ChannelMembers)
                .HasForeignKey(d => d.ChannelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChannelMembers_Channels");

            entity.HasOne(d => d.User).WithMany(p => p.ChannelMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChannelMembers_Users");
        });

        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.HasKey(e => e.TxId);

            entity.Property(e => e.TxId).HasColumnName("TxID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CreatedByUserId).HasColumnName("CreatedByUserID");
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ReliefItemId).HasColumnName("ReliefItemID");
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InventoryTx_CreatedByUser");

            entity.HasOne(d => d.ReliefItem).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => d.ReliefItemId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InventoryTx_ReliefItems");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => d.RescueRequestId)
                .HasConstraintName("FK_InventoryTransactions_RescueRequests");

            entity.HasOne(d => d.Warehouse).WithMany(p => p.InventoryTransactions)
                .HasForeignKey(d => d.WarehouseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InventoryTx_Warehouse");
        });

        modelBuilder.Entity<LogLogin>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__LogLogin__5E5486480FF1C842");

            entity.ToTable("LogLogin");

            entity.Property(e => e.FailReason).HasMaxLength(255);
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(255)
                .HasColumnName("IPAddress");
            entity.Property(e => e.LoginTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.RefreshToken).WithMany(p => p.LogLogins)
                .HasForeignKey(d => d.RefreshTokenId)
                .HasConstraintName("FK_LogLogin_RefreshToken");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => new { e.ChannelId, e.UserId, e.MessageId });

            entity.Property(e => e.ChannelId).HasColumnName("ChannelID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.MessageId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("MessageID");
            entity.Property(e => e.Content).HasMaxLength(1000);
            entity.Property(e => e.CreateAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.ChannelMember).WithMany(p => p.Messages)
                .HasForeignKey(d => new { d.ChannelId, d.UserId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Messages_ChannelMembers");
        });

        modelBuilder.Entity<MissionUpdate>(entity =>
        {
            entity.HasKey(e => e.UpdateId);

            entity.Property(e => e.UpdateId).HasColumnName("UpdateID");
            entity.Property(e => e.MissionId).HasColumnName("MissionID");
            entity.Property(e => e.Note).HasMaxLength(2000);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.UpdatedByUserId).HasColumnName("UpdatedByUserID");

            entity.HasOne(d => d.Mission).WithMany(p => p.MissionUpdates)
                .HasForeignKey(d => d.MissionId)
                .HasConstraintName("FK_MissionUpdates_Mission");

            entity.HasOne(d => d.UpdatedByUser).WithMany(p => p.MissionUpdates)
                .HasForeignKey(d => d.UpdatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MissionUpdates_User");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E39CD80A4E2");

            entity.ToTable("RefreshToken");

            entity.HasIndex(e => e.Token, "UQ__RefreshT__1EB4F8179CC52CFF").IsUnique();

            entity.HasIndex(e => e.JwtId, "UQ__RefreshT__32FE98A3FB5008B8").IsUnique();

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ExpiredAt).HasColumnType("datetime");
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(255)
                .HasColumnName("IPAddress");
            entity.Property(e => e.JwtId).HasMaxLength(100);
            entity.Property(e => e.Token).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RefreshTo__UserI__2F10007B");
        });

        modelBuilder.Entity<ReliefItem>(entity =>
        {
            entity.Property(e => e.ReliefItemId).HasColumnName("ReliefItemID");
            entity.Property(e => e.ItemName).HasMaxLength(200);
            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        modelBuilder.Entity<RescueMembersRoll>(entity =>
        {
            entity.HasIndex(e => e.RollName, "UQ_RescueMembersRolls_RollName").IsUnique();

            entity.Property(e => e.RescueMembersRollId)
                .ValueGeneratedNever()
                .HasColumnName("RescueMembersRollID");
            entity.Property(e => e.RollName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueMission>(entity =>
        {
            entity.HasKey(e => e.MissionId);

            entity.Property(e => e.MissionId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("MissionID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CoordinatorUserId).HasColumnName("CoordinatorUserID");
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");
            entity.Property(e => e.ResultSummary).HasMaxLength(2000);
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.CoordinatorUser).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.CoordinatorUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Missions_Coordinator");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.RescueRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueMissions_RescueRequests");

            entity.HasOne(d => d.Status).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueMissions_RescueMissionsStatus");

            entity.HasOne(d => d.Team).WithMany(p => p.RescueMissions)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Missions_Team");
        });

        modelBuilder.Entity<RescueMissionsStatus>(entity =>
        {
            entity.ToTable("RescueMissionsStatus");

            entity.HasIndex(e => e.StatusName, "UQ_RescueMissionsStatus_StatusName").IsUnique();

            entity.Property(e => e.RescueMissionsStatusId)
                .ValueGeneratedNever()
                .HasColumnName("RescueMissionsStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueRequest>(entity =>
        {
            entity.Property(e => e.RescueRequestId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("RescueRequestID");
            entity.Property(e => e.CitizenUserId).HasColumnName("CitizenUserID");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.LocationText).HasMaxLength(500);
            entity.Property(e => e.PhoneContact)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.VerifiedByUserId).HasColumnName("VerifiedByUserID");

            entity.HasOne(d => d.CitizenUser).WithMany(p => p.RescueRequestCitizenUsers)
                .HasForeignKey(d => d.CitizenUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueRequests_Citizen");

            entity.HasOne(d => d.RequestTypeNavigation).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.RequestType)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueRequests_RescueRequestsTypes");

            entity.HasOne(d => d.StatusNavigation).WithMany(p => p.RescueRequests)
                .HasForeignKey(d => d.Status)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueRequests_RescueRequestsStatus");

            entity.HasOne(d => d.VerifiedByUser).WithMany(p => p.RescueRequestVerifiedByUsers)
                .HasForeignKey(d => d.VerifiedByUserId)
                .HasConstraintName("FK_RescueRequests_VerifiedBy");
        });

        modelBuilder.Entity<RescueRequestAttachment>(entity =>
        {
            entity.HasKey(e => e.AttachmentId);

            entity.Property(e => e.AttachmentId)
                .HasDefaultValueSql("(newsequentialid())")
                .HasColumnName("AttachmentID");
            entity.Property(e => e.ContentType).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.FileBlobId).HasColumnName("FileBlobID");
            entity.Property(e => e.FileName).HasMaxLength(255);
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.RescueRequestAttachments)
                .HasForeignKey(d => d.RescueRequestId)
                .HasConstraintName("FK_ReqAttach_RescueRequests");
        });

        modelBuilder.Entity<RescueRequestStatusHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId);

            entity.ToTable("RescueRequestStatusHistory");

            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ChangedByUserId).HasColumnName("ChangedByUserID");
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.RescueRequestId).HasColumnName("RescueRequestID");

            entity.HasOne(d => d.ChangedByUser).WithMany(p => p.RescueRequestStatusHistories)
                .HasForeignKey(d => d.ChangedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ReqStatusHistory_Users");

            entity.HasOne(d => d.RescueRequest).WithMany(p => p.RescueRequestStatusHistories)
                .HasForeignKey(d => d.RescueRequestId)
                .HasConstraintName("FK_ReqStatusHistory_RescueRequests");
        });

        modelBuilder.Entity<RescueRequestsStatus>(entity =>
        {
            entity.ToTable("RescueRequestsStatus");

            entity.HasIndex(e => e.StatusName, "UQ_RescueRequestsStatus_StatusName").IsUnique();

            entity.Property(e => e.RescueRequestsStatusId)
                .ValueGeneratedNever()
                .HasColumnName("RescueRequestsStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<RescueRequestsType>(entity =>
        {
            entity.HasIndex(e => e.TypeName, "UQ_RescueRequestsTypes_TypeName").IsUnique();

            entity.Property(e => e.RescueRequestsTypeId)
                .ValueGeneratedNever()
                .HasColumnName("RescueRequestsTypeID");
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
            entity.HasKey(e => new { e.TeamId, e.UserId });

            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");

            entity.HasOne(d => d.Role).WithMany(p => p.RescueTeamMembers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RescueTeamMembers_RescueMembersRolls");

            entity.HasOne(d => d.Team).WithMany(p => p.RescueTeamMembers)
                .HasForeignKey(d => d.TeamId)
                .HasConstraintName("FK_TeamMembers_Team");

            entity.HasOne(d => d.User).WithMany(p => p.RescueTeamMembers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_TeamMembers_User");
        });

        modelBuilder.Entity<RescueTeamsStatus>(entity =>
        {
            entity.ToTable("RescueTeamsStatus");

            entity.HasIndex(e => e.StatusName, "UQ_RescueTeamsStatus_StatusName").IsUnique();

            entity.Property(e => e.RescueTeamsStatusId)
                .ValueGeneratedNever()
                .HasColumnName("RescueTeamsStatusID");
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
            entity.Property(e => e.LastPwdChange)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
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

            entity.Property(e => e.MissionId).HasColumnName("MissionID");
            entity.Property(e => e.VehicleId).HasColumnName("VehicleID");
            entity.Property(e => e.AssignedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Mission).WithMany(p => p.VehicleAssignments)
                .HasForeignKey(d => d.MissionId)
                .HasConstraintName("FK_VehicleAssignments_Mission");

            entity.HasOne(d => d.Vehicle).WithMany(p => p.VehicleAssignments)
                .HasForeignKey(d => d.VehicleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VehicleAssignments_Vehicle");
        });

        modelBuilder.Entity<VehiclesStatus>(entity =>
        {
            entity.ToTable("VehiclesStatus");

            entity.HasIndex(e => e.StatusName, "UQ_VehiclesStatus_StatusName").IsUnique();

            entity.Property(e => e.VehiclesStatusId)
                .ValueGeneratedNever()
                .HasColumnName("VehiclesStatusID");
            entity.Property(e => e.StatusName).HasMaxLength(100);
        });

        modelBuilder.Entity<VehiclesType>(entity =>
        {
            entity.HasKey(e => e.VehicleTypeId);

            entity.HasIndex(e => e.TypeName, "UQ_VehiclesTypes_TypeName").IsUnique();

            entity.Property(e => e.VehicleTypeId)
                .ValueGeneratedNever()
                .HasColumnName("VehicleTypeID");
            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.LocationText).HasMaxLength(500);
            entity.Property(e => e.WarehouseName).HasMaxLength(200);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
