namespace DTOs.Overlut;

public class RescueRequestLogDTO
{
    public long LogId { get; set; }

    public int RescueRequestId { get; set; }

    public string? OldRescueRequests { get; set; }

    public int? ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }
}
