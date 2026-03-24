using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AssignmentModel;

public class AssignVolunteerToTeamModel
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int TeamId { get; set; }

    /// <summary>RescueMembersRole ID (Leader / Member etc.)</summary>
    [Required]
    public int RoleId { get; set; }

    public bool NotifyByEmail { get; set; } = true;

    /// <summary>Reserved for future SMS/phone expansion.</summary>
    public bool NotifyBySms { get; set; } = false;

    public string? Note { get; set; }
}
