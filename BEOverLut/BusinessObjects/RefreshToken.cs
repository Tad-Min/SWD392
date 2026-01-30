using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class RefreshToken
{
    public int RefreshTokenId { get; set; }

    public int? UserId { get; set; }

    public string? Token { get; set; }

    public string? JwtId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiredAt { get; set; }

    public bool Revoked { get; set; }

    public string? Ipaddress { get; set; }

    public string? UserAgent { get; set; }

    public virtual ICollection<LogLogin> LogLogins { get; set; } = new List<LogLogin>();

    public virtual User? User { get; set; }
}
