using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class Vehicle
{
    public int VehicleId { get; set; }

    public string VehicleCode { get; set; } = null!;

    public int VehicleType { get; set; }

    public int? Capacity { get; set; }

    public int StatusId { get; set; }

    public string? Note { get; set; }

    public virtual VehiclesStatus Status { get; set; } = null!;

    public virtual ICollection<VehicleAssignment> VehicleAssignments { get; set; } = new List<VehicleAssignment>();

    public virtual VehiclesType VehicleTypeNavigation { get; set; } = null!;
}
