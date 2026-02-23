using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IUserService
    {
        Task<bool> UpdateUserProfileAsync(UserDTO user);
        Task<IEnumerable<UserDTO>?> GetAllUserAsync(int? userId = null, int? roleId = null, string? fullName = null, string? identifyId = null, string? address = null, string? email = null, string? phone = null);
        Task<UserDTO?> GetUserByIdAsync(int userId);
        Task<UserDTO?> GetUserByEmailAndPassword(string email, string password);
        Task<UserDTO?> GetUserByEmailAsync(string email);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> ChangeUserRoleAsync(int userId, int roleId);
    }
}
