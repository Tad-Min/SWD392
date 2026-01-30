using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueRequestAttachment
{
    public Guid AttachmentId { get; set; }

    public Guid RescueRequestId { get; set; }

    public string FileName { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public long FileSize { get; set; }

    public Guid FileBlobId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual RescueRequest RescueRequest { get; set; } = null!;
}
