using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetUserById(int userId);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserByEmailAndPassword(string email, string password);
        Task<IEnumerable<User>?> GetAllUsers(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null);
        Task<User?> CreateUser(User user);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(int userId);
    }
}
