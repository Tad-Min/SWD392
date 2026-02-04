namespace DTOs.Overlut;

public class AttachmentRescueDTO
{
    public Guid AttachmentId { get; set; }

    public int RescueRequestId { get; set; }

    public long FileSize { get; set; }

    public string FileType { get; set; } = null!;

}
