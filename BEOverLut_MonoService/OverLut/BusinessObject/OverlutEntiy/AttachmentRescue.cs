namespace BusinessObject.OverlutEntiy;

public partial class AttachmentRescue
{
    public Guid AttachmentId { get; set; }

    public int RescueRequestId { get; set; }

    public long FileSize { get; set; }

    public string FileType { get; set; } = null!;

    public virtual RescueRequest RescueRequest { get; set; } = null!;
}
