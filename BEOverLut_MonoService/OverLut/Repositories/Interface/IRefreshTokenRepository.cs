using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRefreshTokenRepository
    {
        Task<IEnumerable<RefreshToken>?> GetAllActivedRefreshTokenByUserId(int userId);
        Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken);
        Task<bool> RevokeToken(RefreshToken refreshToken);
        Task<RefreshToken?> GetRefreshTokenByUserIdAndToken(int userId, string token);

    }
}
