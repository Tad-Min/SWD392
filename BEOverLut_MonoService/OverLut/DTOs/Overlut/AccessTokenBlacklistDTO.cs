namespace DTOs.Overlut;

public class AccessTokenBlacklistDTO
{
    public string Jti { get; set; } = null!;

    public int? UserId { get; set; }

    public DateTime ExpireAt { get; set; }

    public string? Reason { get; set; }

}
