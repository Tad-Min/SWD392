using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class UpdateRescueTeam
    {

        [StringLength(100, ErrorMessage = "TeamName cannot exceed 100 characters")]
        public string? TeamName { get; set; } = null!;
        [Required(ErrorMessage = "StatusId required")]
        public int StatusId { get; set; }
    }
}
