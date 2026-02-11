using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class RegisterModel
    {
        private string _email=string.Empty;
        [Required(ErrorMessage = "Email is require.")]
        [EmailAddress(ErrorMessage = "Error email format.")]
        [MaxLength(256)]
        public string Email 
        { 
            get => _email;
            set => _email = value?.Trim().ToLower() ?? string.Empty;
        }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters")]
        [MaxLength(100,ErrorMessage = "Passwords must be under 100 characters.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Password have at least 1 upercase, 1 lowercase, 1 number and 1 special character.")]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "Please confirm password!")]
        [Compare(nameof(Password), ErrorMessage ="Confirm Password not match!")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
