using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class MissionUpdate
{
    public long UpdateId { get; set; }

    public Guid MissionId { get; set; }

    public int UpdatedByUserId { get; set; }

    public int? NewStatus { get; set; }

    public string? Note { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual RescueMission Mission { get; set; } = null!;

    public virtual User UpdatedByUser { get; set; } = null!;
}
