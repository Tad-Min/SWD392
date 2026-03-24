using System;

namespace DTOs.Overlut;

public class RescueTeamMemberDTO
{
    public int MemberId { get; set; }
    public int UserId { get; set; }
    public int TeamId { get; set; }
    public int RoleId { get; set; }
    public DateTime AssignedAt { get; set; }
    public int? AssignedByUserId { get; set; }
    public bool IsActive { get; set; }

    // User info
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}
