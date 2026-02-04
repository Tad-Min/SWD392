using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        public async Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken) => await RefreshTokenDAO.CreateRefreshToken(refreshToken);

        public async Task<bool> UpdateRefreshToken(int refreshTokenId, bool revoked) => await RefreshTokenDAO.UpdateRefreshToken(refreshTokenId, revoked);

        public async Task<RefreshToken?> GetRefreshTokenByToken(string tokenString) => await RefreshTokenDAO.GetRefreshTokenByToken(tokenString);
    }
}
