using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RescueRequestsStatus
{
    public int RescueRequestsStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();
}
