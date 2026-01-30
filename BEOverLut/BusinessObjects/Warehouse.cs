using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace BusinessObjects;

public partial class Warehouse
{
    public int WarehouseId { get; set; }

    public string WarehouseName { get; set; } = null!;

    public Geometry Location { get; set; } = null!;

    public string? LocationText { get; set; }

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
}
