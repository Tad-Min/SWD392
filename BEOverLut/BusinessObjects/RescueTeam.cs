using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueTeam
{
    public int TeamId { get; set; }

    public string TeamName { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual RescueTeamsStatus Status { get; set; } = null!;
}
