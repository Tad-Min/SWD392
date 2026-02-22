using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueMissionModel
{
    public class AddRescueMisstionModel
    {

        public int RescueRequestId { get; set; }
        [Required(ErrorMessage = "Must have description")]
        public int TeamId { get; set; }

        [Required(ErrorMessage ="Must have description")]
        public string? Description { get; set; }

    }
}
