using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueTeamMember
{
    /// <summary>Surrogate PK. Allows 1 user to be in multiple teams over time.</summary>
    public int MemberId { get; set; }

    public int UserId { get; set; }

    public int TeamId { get; set; }

    public int RoleId { get; set; }

    public DateTime AssignedAt { get; set; }

    public int? AssignedByUserId { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual RescueMembersRole Role { get; set; } = null!;

    public virtual RescueTeam Team { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual User? AssignedByUser { get; set; }
}
