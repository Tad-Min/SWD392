using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace BusinessObject.OverlutEntiy;

public partial class Warehouse
{
    public int WarehouseId { get; set; }

    public string WarehouseName { get; set; } = null!;

    public Geometry Location { get; set; } = null!;

    public string? LocationText { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<WarehouseStock> WarehouseStocks { get; set; } = new List<WarehouseStock>();
}
