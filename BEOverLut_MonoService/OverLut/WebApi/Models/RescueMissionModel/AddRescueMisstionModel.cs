using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueMissionModel
{
    public class AddRescueMisstionModel
    {
        [Required(ErrorMessage = "RescueRequestId is required")]
        public int RescueRequestId { get; set; }
        
        [Required(ErrorMessage = "TeamId is required")]
        public int TeamId { get; set; }

        [Required(ErrorMessage ="Must have description")]
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

    }
}
