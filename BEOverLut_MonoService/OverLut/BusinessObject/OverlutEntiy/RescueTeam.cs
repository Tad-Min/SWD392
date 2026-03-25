using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace BusinessObject.OverlutEntiy;

public partial class RescueTeam
{
    public int TeamId { get; set; }

    public string TeamName { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    /// <summary>Text description of the assembly/muster point.</summary>
    public string? AssemblyLocationText { get; set; }

    public Point Location { get; set; } = null!;

    public string? AssemblyNote { get; set; }

    public int? RoleId { get; set; }

    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual RescueTeamsStatus Status { get; set; } = null!;

    public virtual RescueMembersRole? Role { get; set; }

    public virtual ICollection<VolunteerOfferAssignment> VolunteerOfferAssignments { get; set; } = new List<VolunteerOfferAssignment>();
}
