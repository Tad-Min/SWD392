using System.ComponentModel.DataAnnotations;

namespace DTOs.Overlut;

public class UserDTO
{
    public int UserId { get; set; }

    [Required(ErrorMessage = "RoleId is required")]
    public int RoleId { get; set; }

    [StringLength(100, ErrorMessage = "FullName cannot exceed 100 characters")]
    public string? FullName { get; set; }

    [StringLength(20, ErrorMessage = "IdentifyId cannot exceed 20 characters")]
    public string? IdentifyId { get; set; }

    [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
    public string? Address { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(256)]
    public string Email { get; set; } = null!;

    [Phone(ErrorMessage = "Invalid phone number format")]
    [RegularExpression(@"^0[346789]\d{8}$", ErrorMessage = "Phone is not supported in Vietnam")]
    public string? Phone { get; set; }

    public string? Password { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
