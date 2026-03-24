using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class CreateRescueTeamModel
    {
        [Required(ErrorMessage = "Must have team name")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Team name must be between 3 and 100 characters")]
        public string TeamName { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Assembly Location Text cannot exceed 500 characters")]
        public string? AssemblyLocationText { get; set; }

        public double? AssemblyLatitude { get; set; }

        public double? AssemblyLongitude { get; set; }

        [StringLength(1000, ErrorMessage = "Assembly Note cannot exceed 1000 characters")]
        public string? AssemblyNote { get; set; }

        public int? RoleId { get; set; }
    }
}
