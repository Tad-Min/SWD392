using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueRequestStatusHistory
{
    public long HistoryId { get; set; }

    public Guid RescueRequestId { get; set; }

    public int? OldStatus { get; set; }

    public int NewStatus { get; set; }

    public string? Note { get; set; }

    public int ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual User ChangedByUser { get; set; } = null!;

    public virtual RescueRequest RescueRequest { get; set; } = null!;
}
