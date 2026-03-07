using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueMissionModel
{
    public class UpdateRescueMisstionModel
    {
        [Required(ErrorMessage = "Must have MissionId")]
        public int MissionId { get; set; }
        
        [Required(ErrorMessage = "Must have RescueRequestId")]
        public int RescueRequestId { get; set; }
        
        [Required(ErrorMessage = "Must have TeamId")]
        public int TeamId { get; set; }
        
        [Required(ErrorMessage ="Must have StatusId")]
        public int StatusId { get; set; }
        
        [Required(ErrorMessage = "Must have Description")]
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

    }
}
