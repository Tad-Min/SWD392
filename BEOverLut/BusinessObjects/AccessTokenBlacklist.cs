using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class AccessTokenBlacklist
{
    public string JwtId { get; set; } = null!;

    public int? UserId { get; set; }

    public DateTime ExpireAt { get; set; }

    public string? Reason { get; set; }

    public virtual User? User { get; set; }
}
