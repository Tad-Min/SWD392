using System;

namespace BusinessObject.OverlutEntiy;

public partial class VolunteerProfile
{
    public int VolunteerProfileId { get; set; }

    /// <summary>FK to the existing User. No new account is created.</summary>
    public int UserId { get; set; }

    /// <summary>Pending = 0, Approved = 1, Rejected = 2, Suspended = 3</summary>
    public int ApplicationStatus { get; set; }

    public int? ApprovedByManagerId { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public string? RejectedReason { get; set; }

    public bool IsAvailable { get; set; } = true;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? VolunteerProvince { get; set; }
    public string? VolunteerWard { get; set; }

    // Navigation
    public virtual User User { get; set; } = null!;
    public virtual User? ApprovedByManager { get; set; }

    public virtual ICollection<VolunteerSkill> VolunteerSkills { get; set; } = new List<VolunteerSkill>();
}
