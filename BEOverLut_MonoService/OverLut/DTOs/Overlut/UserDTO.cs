namespace DTOs.Overlut;

public class UserDTO
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string? FullName { get; set; }

    public string? IdentifyId { get; set; }

    public string? Address { get; set; }

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
