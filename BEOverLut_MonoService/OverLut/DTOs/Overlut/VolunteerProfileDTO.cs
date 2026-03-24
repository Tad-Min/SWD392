using System;

namespace DTOs.Overlut;

public class VolunteerProfileDTO
{
    public int VolunteerProfileId { get; set; }
    public int UserId { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }

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
}
