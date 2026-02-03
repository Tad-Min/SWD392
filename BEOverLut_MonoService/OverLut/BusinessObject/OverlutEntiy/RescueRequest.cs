using NetTopologySuite.Geometries;

namespace BusinessObject.OverlutEntiy;

public partial class RescueRequest
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

    public virtual ICollection<AttachmentRescue> AttachmentRescues { get; set; } = new List<AttachmentRescue>();

    public virtual RescueRequestsType RequestTypeNavigation { get; set; } = null!;

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueRequestLog> RescueRequestLogs { get; set; } = new List<RescueRequestLog>();

    public virtual RescueRequestsStatus StatusNavigation { get; set; } = null!;

    public virtual UrgencyLevel? UrgencyLevelNavigation { get; set; }

    public virtual User? UserReq { get; set; }
}
