using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class RescueMissionDTO
{
    public int MissionId { get; set; }

    [Required(ErrorMessage = "RescueRequestId is required")]
    public int RescueRequestId { get; set; }

    [Required(ErrorMessage = "CoordinatorUserId is required")]
    public int CoordinatorUserId { get; set; }

    [Required(ErrorMessage = "TeamId is required")]
    public int TeamId { get; set; }

    public int StatusId { get; set; }

    public DateTime AssignedAt { get; set; }

    public string? Description { get; set; }
}
