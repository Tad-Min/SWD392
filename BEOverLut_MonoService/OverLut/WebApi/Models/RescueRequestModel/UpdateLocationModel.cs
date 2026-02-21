using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.RescueRequestModel
{
    public class UpdateLocationModel
    {
        [Required(ErrorMessage = "Must have Rescue Request Id")]
        public int RescueRequestId { get; set; }
       
    }
}
