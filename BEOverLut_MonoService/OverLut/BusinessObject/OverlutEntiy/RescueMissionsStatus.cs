using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueMissionsStatus
{
    public int RescueMissionsStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<RescueMission> RescueMissions { get; set; } = new List<RescueMission>();
}
