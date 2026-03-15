using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RefreshTokenDAO _refreshTokenDAO;

        public RefreshTokenRepository(OverlutDbContext db)
        {
            _db = db;
            _refreshTokenDAO = new RefreshTokenDAO(db);
        }
        public async Task<IEnumerable<RefreshToken>?> GetAllActivedRefreshTokenByUserId(int userId) => await _refreshTokenDAO.GetAllActivedRefreshTokenByUserId(userId);

        public async Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken) => await _refreshTokenDAO.CreateRefreshToken(refreshToken);

        public async Task<bool> RevokeToken(RefreshToken refreshToken) => await _refreshTokenDAO.RevokeToken(refreshToken);

        public async Task<RefreshToken?> GetRefreshTokenByUserIdAndToken(int userId, string token) => await _refreshTokenDAO.GetRefreshTokenByUserIdAndToken(userId, token);
    }
}
