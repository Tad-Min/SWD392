namespace BusinessObject.OverlutEntiy;

public partial class LogLogin
{
    public int LogId { get; set; }

    public int? RefreshTokenId { get; set; }

    public bool Success { get; set; }

    public string? FailReason { get; set; }

    public string? Ipaddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime LoginTime { get; set; }

    public virtual RefreshToken? RefreshToken { get; set; }
}
