namespace BusinessObject.OverlutEntiy;

public partial class AttachmentMission
{
    public Guid AttachmentId { get; set; }

    public int MissionId { get; set; }

    public long FileSize { get; set; }

    public string FileType { get; set; } = null!;

    public virtual RescueMission Mission { get; set; } = null!;
}
