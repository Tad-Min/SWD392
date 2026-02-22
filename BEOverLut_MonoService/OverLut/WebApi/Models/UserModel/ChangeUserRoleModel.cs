using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.UserModel
{
    public class ChangeUserRoleModel
    {

        [Required]
        public int UserId { get; set; }
        [Required]
        public int RoleId { get; set; }
    }
}
