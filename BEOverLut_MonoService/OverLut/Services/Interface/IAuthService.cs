using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IAuthService
    {

        #region Logout & Register
        Task<bool> LogoutAsync(int userId, string token);
        Task<User?> RegisterAsync(string email, string password);
        #endregion
        #region ResetPassword & ComfirmEmail
        Task<User> ResetPasswordAsync(string email);
        Task<bool> ComfirmEmailAsync(string email, string token);
        #endregion
        #region GetAccessToken & GetRefreshToken
        Task<string?> GenerateAccessTokenAsync(UserDTO user,string refreshToken);
        Task<string> GenerateRefreshTokenAsync(UserDTO user, string? UserAngent, string? ipAddress);
        #endregion
    }
}
