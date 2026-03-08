using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace DTOs.Overlut;

public class WarehouseDTO
{
    public int WarehouseId { get; set; }

    [Required(ErrorMessage = "WarehouseName is required")]
    [StringLength(200, ErrorMessage = "WarehouseName cannot exceed 200 characters")]
    public string WarehouseName { get; set; } = null!;

    [Required]
    public Point Location { get; set; } = null!;

    [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters")]
    public string? Address { get; set; }

    public bool IsActive { get; set; }
}
