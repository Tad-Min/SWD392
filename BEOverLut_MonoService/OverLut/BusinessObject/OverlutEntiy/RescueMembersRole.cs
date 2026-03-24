using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueMembersRole
{
    public int RescueMembersRoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual ICollection<RescueTeam> RescueTeams { get; set; } = new List<RescueTeam>();
}
