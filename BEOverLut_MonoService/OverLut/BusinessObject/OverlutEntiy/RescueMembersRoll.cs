using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueMembersRoll
{
    public int RescueMembersRollId { get; set; }

    public string RollName { get; set; } = null!;

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();
}
