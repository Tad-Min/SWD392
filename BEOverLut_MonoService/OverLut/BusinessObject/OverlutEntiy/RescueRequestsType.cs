using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class RescueRequestsType
{
    public int RescueRequestsTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<RescueRequest> RescueRequests { get; set; } = new List<RescueRequest>();
}
