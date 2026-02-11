using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class ReturnLoginModel
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        public string Token { get; set; } = string.Empty;
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
