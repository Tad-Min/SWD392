using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class VehiclesStatus
{
    public int VehiclesStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
