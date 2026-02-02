using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RefreshTokenDAO
{
    public static async Task<RefreshToken?> CreateRefreshToken(int? userId, string token, string jti, DateTime createdAt, DateTime expiredAt, string? ipAddress, string? userAgent)
    {
        using var db = new OverlutDbContext();
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = token,
            Jti = jti,
            CreatedAt = createdAt,
            ExpiredAt = expiredAt,
            Revoked = false,
            Ipaddress = ipAddress,
            UserAgent = userAgent
        };
        await db.RefreshTokens.AddAsync(refreshToken);
        await db.SaveChangesAsync();
        return refreshToken;
    }

    public static async Task<bool> UpdateRefreshToken(int refreshTokenId, bool revoked)
    {
        using var db = new OverlutDbContext();
        var token = await db.RefreshTokens.FirstOrDefaultAsync(x => x.RefreshTokenId == refreshTokenId);
        if (token == null) return false;

        token.Revoked = revoked;
        db.RefreshTokens.Update(token);
        await db.SaveChangesAsync();
        return true;
    }

    public static async Task<RefreshToken?> GetRefreshTokenByToken(string tokenString)
    {
        using var db = new OverlutDbContext();
        return await db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenString);
    }

    public static async Task<IEnumerable<RefreshToken>?> GetRefreshTokenByUserId(int userId)
    {
        using var db = new OverlutDbContext();
        return await db.RefreshTokens.Where(x => x.UserId == userId).ToListAsync();
    }

    public static async Task<bool> DeleteRefreshTokenByToken(string tokenString)
    {
        using var db = new OverlutDbContext();
        var token = await db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenString);
        if (token == null) return false;

        db.RefreshTokens.Remove(token);
        await db.SaveChangesAsync();
        return true;
    }
}
