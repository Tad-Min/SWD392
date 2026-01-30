using System;
using System.Collections.Generic;
using NetTopologySuite.Geometries;

namespace BusinessObjects;

public partial class RescueRequest
{
    public Guid RescueRequestId { get; set; }

    public int CitizenUserId { get; set; }

    public int RequestType { get; set; }

    public int UrgencyLevel { get; set; }

    public int Status { get; set; }

    public string? Description { get; set; }

    public int? PeopleCount { get; set; }

    public string? PhoneContact { get; set; }

    public Geometry? Location { get; set; }

    public string? LocationText { get; set; }

    public int? VerifiedByUserId { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User CitizenUser { get; set; } = null!;

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

    public virtual RescueRequestsType RequestTypeNavigation { get; set; } = null!;

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueRequestAttachment> RescueRequestAttachments { get; set; } = new List<RescueRequestAttachment>();

    public virtual ICollection<RescueRequestStatusHistory> RescueRequestStatusHistories { get; set; } = new List<RescueRequestStatusHistory>();

    public virtual RescueRequestsStatus StatusNavigation { get; set; } = null!;

    public virtual User? VerifiedByUser { get; set; }
}
