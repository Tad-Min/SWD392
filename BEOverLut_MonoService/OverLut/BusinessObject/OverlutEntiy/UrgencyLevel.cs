using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class UrgencyLevel
{
    public int UrgencyLevelId { get; set; }

    public string UrgencyName { get; set; } = null!;

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();
}
