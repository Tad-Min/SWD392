using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class User
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string? FullName { get; set; }

    public string? IdentifyId { get; set; }

    public string? Address { get; set; }

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public DateTime LastPwdChange { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<AccessTokenBlacklist> AccessTokenBlacklists { get; set; } = new List<AccessTokenBlacklist>();

    public virtual ICollection<ChannelMember> ChannelMembers { get; set; } = new List<ChannelMember>();

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

    public virtual ICollection<MissionUpdate> MissionUpdates { get; set; } = new List<MissionUpdate>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueRequest> RescueRequestCitizenUsers { get; set; } = new List<RescueRequest>();

    public virtual ICollection<RescueRequestStatusHistory> RescueRequestStatusHistories { get; set; } = new List<RescueRequestStatusHistory>();

    public virtual ICollection<RescueRequest> RescueRequestVerifiedByUsers { get; set; } = new List<RescueRequest>();

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual Role Role { get; set; } = null!;
}
