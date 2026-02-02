using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutStorageEntiy;

public partial class FileChunk
{
    public Guid ChunkId { get; set; }

    public Guid AttachmentId { get; set; }

    public int SequenceNumber { get; set; }

    public byte[] Data { get; set; } = null!;

    public virtual Attachment Attachment { get; set; } = null!;
}
