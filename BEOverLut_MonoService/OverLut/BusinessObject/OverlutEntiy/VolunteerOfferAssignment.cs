using System;

namespace BusinessObject.OverlutEntiy;

public partial class VolunteerOfferAssignment
{
    public int OfferAssignmentId { get; set; }

    public int OfferId { get; set; }

    public int? TeamId { get; set; }

    public int? MissionId { get; set; }

    public int AssignedByManagerId { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? ReceivedAt { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public string? ReturnConditionNote { get; set; }

    // Navigation
    public virtual VolunteerOffer Offer { get; set; } = null!;
    public virtual RescueTeam? Team { get; set; }
    public virtual User AssignedByManager { get; set; } = null!;
}
