namespace DTOs.Overlut;

public class RescueTeamMemberDTO
{
    public int UserId { get; set; }

    public int TeamId { get; set; }

    public int RoleId { get; set; }
    
    // User info (populated when .Include(x => x.User) is applied in DAO)
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

