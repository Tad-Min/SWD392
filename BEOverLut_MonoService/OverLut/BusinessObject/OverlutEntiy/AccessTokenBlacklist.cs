using System;
using System.Collections.Generic;

namespace BusinessObject.OverlutEntiy;

public partial class AccessTokenBlacklist
{
    public string Jti { get; set; } = null!;

    public int? UserId { get; set; }

    public DateTime ExpireAt { get; set; }

    public string? Reason { get; set; }

    public virtual User? User { get; set; }
}
