namespace DTOs.Overlut;

public class RefreshTokenDTO
{
    public int RefreshTokenId { get; set; }

    public int? UserId { get; set; }

    public string? Token { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiredAt { get; set; }

    public bool Revoked { get; set; }

    public string? Ipaddress { get; set; }

    public string? UserAgent { get; set; }
}
