using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class VehicleAssignment
{
    public int MissionId { get; set; }

    public int VehicleId { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? ReleasedAt { get; set; }

    public virtual RescueMission Mission { get; set; } = null!;

    public virtual Vehicle Vehicle { get; set; } = null!;
}
