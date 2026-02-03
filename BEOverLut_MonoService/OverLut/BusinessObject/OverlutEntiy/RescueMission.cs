namespace BusinessObject.OverlutEntiy;

public partial class RescueMission
{
    public int MissionId { get; set; }

    public int RescueRequestId { get; set; }

    public int CoordinatorUserId { get; set; }

    public int TeamId { get; set; }

    public int StatusId { get; set; }

    public DateTime AssignedAt { get; set; }

    public virtual ICollection<AttachmentMission> AttachmentMissions { get; set; } = new List<AttachmentMission>();

    public virtual User CoordinatorUser { get; set; } = null!;

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

    public virtual ICollection<MissionLog> MissionLogs { get; set; } = new List<MissionLog>();

    public virtual RescueRequest RescueRequest { get; set; } = null!;

    public virtual RescueMissionsStatus Status { get; set; } = null!;

    public virtual ICollection<VehicleAssignment> VehicleAssignments { get; set; } = new List<VehicleAssignment>();
}
