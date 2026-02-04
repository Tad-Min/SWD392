namespace DTOs.Overlut;

public class VehicleAssignmentDTO
{
    public int MissionId { get; set; }

    public int VehicleId { get; set; }

    public DateTime AssignedAt { get; set; }

    public DateTime? ReleasedAt { get; set; }
}
