using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueTeamMember
{
    public int TeamId { get; set; }

    public int UserId { get; set; }

    public int RoleId { get; set; }

    public virtual RescueMembersRoll Role { get; set; } = null!;

    public virtual RescueTeam Team { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
