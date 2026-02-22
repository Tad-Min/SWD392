namespace WebApi.Models.UserModel
{
    public class UpdateUserModel
    {
        public int UserId { get; set; }

        public string? FullName { get; set; }

        public string? IdentifyId { get; set; }

        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
    }
}
