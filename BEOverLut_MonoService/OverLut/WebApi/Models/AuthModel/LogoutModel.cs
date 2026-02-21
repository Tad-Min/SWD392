using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Models.AuthModel
{
    public class LogoutModel
    {
        [Required(ErrorMessage ="Must have UserId")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Must have RefreshToken")]
        public string RefeshToken { get; set; } = string.Empty;
    }
}
