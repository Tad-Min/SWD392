using System;

namespace DTOs.Overlut;

public class VolunteerOfferAssignmentDTO
{
    public int OfferAssignmentId { get; set; }
    public int OfferId { get; set; }
    public string? OfferName { get; set; }
    public int? TeamId { get; set; }
    public string? TeamName { get; set; }
    public int? MissionId { get; set; }
    public int AssignedByManagerId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public DateTime? ReturnedAt { get; set; }
    public string? ReturnConditionNote { get; set; }
}
