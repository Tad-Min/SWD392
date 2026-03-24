using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class User
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string? FullName { get; set; }

    public string? IdentifyId { get; set; }

    public string? Address { get; set; }

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();

    // Navigation to team memberships (one user can now be in multiple teams via MemberId PK)
    public virtual ICollection<RescueTeamMember> RescueTeamMembers { get; set; } = new List<RescueTeamMember>();

    public virtual Role Role { get; set; } = null!;

    // Volunteer navigation
    public virtual VolunteerProfile? VolunteerProfile { get; set; }

    public virtual ICollection<VolunteerSkill> VolunteerSkills { get; set; } = new List<VolunteerSkill>();

    public virtual ICollection<VolunteerOffer> VolunteerOffers { get; set; } = new List<VolunteerOffer>();
}
