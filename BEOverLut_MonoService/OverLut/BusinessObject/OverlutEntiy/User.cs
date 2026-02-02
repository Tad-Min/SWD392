using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

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

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<AccessTokenBlacklist> AccessTokenBlacklists { get; set; } = new List<AccessTokenBlacklist>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();

    public virtual RescueTeamMember? RescueTeamMember { get; set; }

    public virtual Role Role { get; set; } = null!;
}
