
namespace WebApi.Models.UserModel
{
    public class GetAllUserModel
    {
        public int? userId { get; set; }
        public int? roleId { get; set; }
        public string? fullName { get; set; }
        public string? identifyId { get; set; }
        public string? address {  get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
    }
}
