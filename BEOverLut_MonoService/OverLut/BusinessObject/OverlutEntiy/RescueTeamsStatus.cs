using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueTeamsStatus
{
    public int RescueTeamsStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<RescueTeam> RescueTeams { get; set; } = new List<RescueTeam>();
}
