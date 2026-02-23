namespace WebApi.Models.VehicleModel
{
    public class GetAllAssignVehicleModel
    {
        public int? missionId {get; set; } 
        public int? vehicleId {get; set; }
        public DateTime? assignedAt {get; set; }
        public DateTime? releasedAt { get; set; }
    }
}
