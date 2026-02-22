using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueMissionModel
{
    public class UpdateRescueMisstionModel
    {
        [Required(ErrorMessage = "Must have MissionId")]
        public int MissionId { get; set; }
        
        public int RescueRequestId { get; set; }
        [Required(ErrorMessage = "Must have TeamId")]
        public int TeamId { get; set; }
        [Required(ErrorMessage ="Must have StatusId")]
        public int StatusId { get; set; }
        [Required(ErrorMessage = "Must have Description")]
        public string? Description { get; set; }

    }
}
