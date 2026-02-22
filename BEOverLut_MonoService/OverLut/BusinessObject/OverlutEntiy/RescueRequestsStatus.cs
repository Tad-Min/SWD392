using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueRequestsStatus
{
    public int RescueRequestsStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();
}
