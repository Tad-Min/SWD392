using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class RoleDTO
{
    [Required]
    public int RoleId { get; set; }
    [Required]
    public string RoleName { get; set; } = null!;
}
