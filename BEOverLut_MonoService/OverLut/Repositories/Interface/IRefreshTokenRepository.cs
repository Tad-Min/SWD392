using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRefreshTokenRepository
    {
        Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken);
        Task<bool> UpdateRefreshToken(int refreshTokenId, bool revoked);
        Task<RefreshToken?> GetRefreshTokenByToken(string tokenString);
    }
}
