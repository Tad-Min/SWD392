using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class RescueMembersRoleDTO
{
    [Required]
    public int RescueMembersRoleId { get; set; }
    [Required]
    public string RoleName { get; set; } = null!;

}
