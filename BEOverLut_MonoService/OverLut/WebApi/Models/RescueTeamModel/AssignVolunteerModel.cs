using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class AssignVolunteerModel
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int TeamId { get; set; }

        [Required]
        public int RoleId { get; set; }

        public bool NotifyByEmail { get; set; } = true;

        public string? Note { get; set; }
    }
}
