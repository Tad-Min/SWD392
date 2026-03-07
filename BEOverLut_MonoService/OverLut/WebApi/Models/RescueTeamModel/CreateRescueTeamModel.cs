using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class CreateRescueTeamModel
    {
        [Required(ErrorMessage = "Must have team name")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Team name must be between 3 and 100 characters")]
        public string TeamName { get; set; } = null!;
    }
}
