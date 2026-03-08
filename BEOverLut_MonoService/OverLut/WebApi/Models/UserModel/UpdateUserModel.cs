using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.UserModel
{
    public class UpdateUserModel
    {
        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }

        [StringLength(100, ErrorMessage = "FullName cannot exceed 100 characters")]
        public string? FullName { get; set; }

        [StringLength(20, ErrorMessage = "IdentifyId cannot exceed 20 characters")]
        public string? IdentifyId { get; set; }

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string? Address { get; set; }

        [RegularExpression(@"^0[346789]\d{8}$", ErrorMessage = "Phone is not supported in Vietnam")]
        public string? Phone { get; set; }

        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(100, ErrorMessage = "Passwords must be under 100 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Password must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character")]
        public string? Password { get; set; }
    }
}
