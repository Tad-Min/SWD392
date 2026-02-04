using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IAuthService
    {

        #region Login & Logout & Register
        Task<string?> LoginAsync(string username, string password);
        Task<bool> LogoutAsync();
        Task<User> RegisterAsync();
        #endregion
        #region ResetPassword & ComfirmEmail
        Task<User> ResetPasswordAsync(string email);
        Task<bool> ComfirmEmailAsync(string email, string token);
        #endregion
        #region GetJti & GetAccessToken
        Task<Guid> GetJtiAsync();
        Task<string?> GetAccessTokenAsync(string refreshToken);
        #endregion
    }
}
