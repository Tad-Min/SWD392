using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueTeamModel
{
    public class DeleteRescueTeamMember
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int TeamId { get; set; }
    }
}
