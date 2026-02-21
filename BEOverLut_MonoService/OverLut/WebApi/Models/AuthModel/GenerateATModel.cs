using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.AuthModel
{
    public class GenerateATModel
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int RefeshToken { get; set; }
    }
}
