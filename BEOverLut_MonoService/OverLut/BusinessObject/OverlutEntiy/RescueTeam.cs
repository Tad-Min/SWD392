using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueTeam
{
    public int TeamId { get; set; }

    public string TeamName { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual RescueTeamsStatus Status { get; set; } = null!;
}
