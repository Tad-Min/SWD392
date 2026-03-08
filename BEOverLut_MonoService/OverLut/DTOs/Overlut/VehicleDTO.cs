using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class VehicleDTO
{
    public int VehicleId { get; set; }

    [Required(ErrorMessage = "VehicleCode is required")]
    [StringLength(50, ErrorMessage = "VehicleCode cannot exceed 50 characters")]
    public string VehicleCode { get; set; } = null!;

    [Required(ErrorMessage = "VehicleType is required")]
    public int VehicleType { get; set; }

    [Range(1, 100, ErrorMessage = "Capacity must be between 1 and 100")]
    public int? Capacity { get; set; }

    public int StatusId { get; set; }

    [StringLength(500, ErrorMessage = "Note cannot exceed 500 characters")]
    public string? Note { get; set; }
}
