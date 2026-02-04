using NetTopologySuite.Geometries;

namespace DTOs.Overlut;

public class RescueRequestDTO
{
    public int RescueRequestId { get; set; }

    public int? UserReqId { get; set; }

    public int RequestType { get; set; }

    public int? UrgencyLevel { get; set; }

    public string? Ipaddress { get; set; }

    public string? UserAgent { get; set; }

    public int Status { get; set; }

    public string? Description { get; set; }

    public int? PeopleCount { get; set; }

    public Geometry? Location { get; set; }

    public string? LocationText { get; set; }

    public DateTime CreatedAt { get; set; }
}
