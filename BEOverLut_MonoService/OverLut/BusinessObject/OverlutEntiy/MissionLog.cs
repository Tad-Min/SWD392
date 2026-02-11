using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class MissionLog
{
    public long LogId { get; set; }

    public int MissionId { get; set; }

    public string? OldRescueMissions { get; set; }

    public int ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; }

    public virtual RescueMission Mission { get; set; } = null!;
}
