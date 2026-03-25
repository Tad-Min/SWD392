using System;
using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace DTOs.Overlut;

public class RescueTeamDTO
{
    public int TeamId { get; set; }

    public string TeamName { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsActive { get; set; }

    /// <summary>Text description of the assembly/muster point.</summary>
    public string? AssemblyLocationText { get; set; }

    public Point Location { get; set; } = null!;

    public string? AssemblyNote { get; set; }

    public int? RoleId { get; set; }
}
