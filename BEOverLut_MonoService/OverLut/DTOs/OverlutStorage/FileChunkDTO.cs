namespace DTOs.OverlutStorage;

public class FileChunkDTO
{
    public Guid ChunkId { get; set; }

    public Guid AttachmentId { get; set; }

    public int SequenceNumber { get; set; }

    public byte[] Data { get; set; } = null!;

}
