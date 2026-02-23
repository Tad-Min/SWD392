using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.VehicleModel
{
    public class CreateAssignVehicleModel
    {
        [Required]
        public int MissionId { get; set; }
        [Required]
        public int VehicleId { get; set; }
    }
}
