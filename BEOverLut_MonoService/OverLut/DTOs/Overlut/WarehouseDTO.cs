using NetTopologySuite.Geometries;

namespace DTOs.Overlut;

public class WarehouseDTO
{
    public int WarehouseId { get; set; }

    public string WarehouseName { get; set; } = null!;

    public Geometry Location { get; set; } = null!;

    public string? LocationText { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; }
}
