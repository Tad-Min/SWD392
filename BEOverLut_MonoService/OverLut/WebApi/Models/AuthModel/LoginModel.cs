using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AuthModel
{
    public class LoginModel 
    {
        private string _email = string.Empty;
        [Required(ErrorMessage = "Email is require.")]
        [EmailAddress(ErrorMessage = "Error email format.")]
        [MaxLength(256)]
        public string Email
        {
            get => _email;
            set => _email = value?.Trim().ToLower() ?? string.Empty;
        }
        [Required(ErrorMessage = "Password can not empty")]
        public string Password { get; set; } = string.Empty;

    }
}
