using System.ComponentModel.DataAnnotations;
using NetTopologySuite.Geometries;

namespace DTOs.Overlut;

public class RescueRequestDTO
{
    public int RescueRequestId { get; set; }

    public int? UserReqId { get; set; }

    [Required(ErrorMessage = "RequestType is required")]
    public int RequestType { get; set; }

    public int? UrgencyLevel { get; set; }

    [StringLength(50)]
    public string? Ipaddress { get; set; }

    [StringLength(500)]
    public string? UserAgent { get; set; }

    public int Status { get; set; }

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [Range(1, 1000, ErrorMessage = "People count must be between 1 and 1000")]
    public int? PeopleCount { get; set; }

    public Point? Location { get; set; }

    [StringLength(500, ErrorMessage = "LocationText cannot exceed 500 characters")]
    public string? LocationText { get; set; }

    public DateTime CreatedAt { get; set; }
}
