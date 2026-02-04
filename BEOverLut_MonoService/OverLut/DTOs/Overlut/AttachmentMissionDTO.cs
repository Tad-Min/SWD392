namespace DTOs.Overlut;

public class AttachmentMissionDTO
{
    public Guid AttachmentId { get; set; }

    public int MissionId { get; set; }

    public long FileSize { get; set; }

    public string FileType { get; set; } = null!;

}
