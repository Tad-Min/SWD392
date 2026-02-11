using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class GenerateATModel
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int RefeshToken { get; set; }
    }
}
