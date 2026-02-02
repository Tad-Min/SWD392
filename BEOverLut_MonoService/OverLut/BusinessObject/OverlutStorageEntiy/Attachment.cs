using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutStorageEntiy;

public partial class Attachment
{
    public Guid AttachmentId { get; set; }

    public bool? IsComplete { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<FileChunk> FileChunks { get; set; } = new List<FileChunk>();
}
