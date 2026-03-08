using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class RescueTeamDTO
{
    public int TeamId { get; set; }

    [Required(ErrorMessage = "TeamName is required")]
    [StringLength(100, ErrorMessage = "TeamName cannot exceed 100 characters")]
    public string TeamName { get; set; } = null!;

    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; }
}
