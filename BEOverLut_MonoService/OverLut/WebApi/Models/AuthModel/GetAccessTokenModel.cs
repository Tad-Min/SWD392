using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AuthModel
{
    public class GetAccessTokenModel
    {
        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Refresh Token is required")]
        public string RefeshToken { get; set; } = string.Empty;
    }
}
