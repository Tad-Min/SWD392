namespace DTOs.Overlut;

public class MissionLogDTO
{
    public long LogId { get; set; }

    public int MissionId { get; set; }

    public string? OldRescueMissions { get; set; }

    public int ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }

}
