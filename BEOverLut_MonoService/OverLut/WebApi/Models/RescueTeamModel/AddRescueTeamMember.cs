using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class AddRescueTeamMember
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int TeamId { get; set; }
        [Required]
        public int RoleId { get; set; }
    }
}
