using System;
using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class RescueTeamDTO
{
    public int TeamId { get; set; }

    [Required(ErrorMessage = "TeamName is required")]
    [StringLength(200, ErrorMessage = "TeamName cannot exceed 200 characters")]
    public string TeamName { get; set; } = null!;
    public int StatusId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
    public string? AssemblyLocationText { get; set; }
    public double? AssemblyLatitude { get; set; }
    public double? AssemblyLongitude { get; set; }
    public string? AssemblyNote { get; set; }
}
