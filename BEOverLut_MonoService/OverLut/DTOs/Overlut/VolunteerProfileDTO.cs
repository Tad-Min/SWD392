using System;

namespace DTOs.Overlut;

public class VolunteerProfileDTO
{
    public int VolunteerProfileId { get; set; }
    public int UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? IdentifyId { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }

    /// <summary>0=Pending, 1=Approved, 2=Rejected, 3=Suspended</summary>
    public int ApplicationStatus { get; set; }
    public string ApplicationStatusName => ApplicationStatus switch
    {
        0 => "Pending",
        1 => "Approved",
        2 => "Rejected",
        3 => "Suspended",
        _ => "Unknown"
    };

    public int? ApprovedByManagerId { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectedReason { get; set; }
    public bool IsAvailable { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? VolunteerProvince { get; set; }
    public string? VolunteerWard { get; set; }

    public List<VolunteerSkillDTO> Skills { get; set; } = new();

    // Coordination Info
    public string? JoinedTeamName { get; set; }
    public string? AssemblyPoint { get; set; }
    public string? TeamRoleName { get; set; }

    public List<VolunteerOfferSummaryDTO> ActiveOffers { get; set; } = new();
}

public class VolunteerOfferSummaryDTO
{
    public int OfferId { get; set; }
    public string TypeName { get; set; } = null!;
    public string? OfferName { get; set; }
    public decimal Quantity { get; set; }
    public string? Unit { get; set; }
    public string? StatusName { get; set; }
    public string? DropoffLocation { get; set; }
}
