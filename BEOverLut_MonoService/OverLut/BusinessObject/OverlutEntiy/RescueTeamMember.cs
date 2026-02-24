using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueTeamMember
{
    public int UserId { get; set; }

    public int TeamId { get; set; }

    public int RoleId { get; set; }

    public virtual RescueMembersRole Role { get; set; } = null!;

    public virtual RescueTeam Team { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
