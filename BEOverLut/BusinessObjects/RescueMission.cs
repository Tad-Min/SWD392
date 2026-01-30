using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueMission
{
    public Guid MissionId { get; set; }

    public Guid RescueRequestId { get; set; }

    public int CoordinatorUserId { get; set; }

    public int TeamId { get; set; }

    public int StatusId { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? ResultSummary { get; set; }

    public virtual User CoordinatorUser { get; set; } = null!;

    public virtual ICollection<MissionUpdate> MissionUpdates { get; set; } = new List<MissionUpdate>();

    public virtual RescueRequest RescueRequest { get; set; } = null!;

    public virtual RescueMissionsStatus Status { get; set; } = null!;

    public virtual RescueTeam Team { get; set; } = null!;

    public virtual ICollection<VehicleAssignment> VehicleAssignments { get; set; } = new List<VehicleAssignment>();
}
