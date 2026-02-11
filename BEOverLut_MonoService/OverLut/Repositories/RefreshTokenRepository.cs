using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        public async Task<IEnumerable<RefreshToken>?> GetAllActivedRefreshTokenByUserId(int userId) => await RefreshTokenDAO.GetAllActivedRefreshTokenByUserId(userId);

        public async Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken) => await RefreshTokenDAO.CreateRefreshToken(refreshToken);

        public async Task<bool> RevokeToken(RefreshToken refreshToken) => await RefreshTokenDAO.RevokeToken(refreshToken);

        public async Task<RefreshToken?> GetRefreshTokenByUserIdAndToken(int userId, string token) => await RefreshTokenDAO.GetRefreshTokenByUserIdAndToken(userId, token);
    }
}
