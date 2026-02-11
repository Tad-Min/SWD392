using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface IUserService
    {
        Task<bool> UpdateUserProfileAsync(User user);
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<User?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByEmailAndPassword(string email, string password);
        Task<User?> GetUserByEmailAsync(string email);
    }
}
