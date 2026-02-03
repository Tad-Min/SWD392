using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RefreshTokenDAO
{
    public static async Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken)
    {
        try
        {
            if (refreshToken == null)
                throw new ArgumentNullException(nameof(refreshToken));

            using var db = new OverlutDbContext();
            refreshToken.Revoked = false;
            await db.RefreshTokens.AddAsync(refreshToken);
            await db.SaveChangesAsync();
            return refreshToken;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-CreateRefreshToken: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRefreshToken(int refreshTokenId, bool revoked)
    {
        try
        {
            using var db = new OverlutDbContext();
            var token = await db.RefreshTokens.FirstOrDefaultAsync(x => x.RefreshTokenId == refreshTokenId);
            if (token == null) return false;

            token.Revoked = revoked;
            db.RefreshTokens.Update(token);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-UpdateRefreshToken: {ex.Message}");
            return false;
        }
    }

    public static async Task<RefreshToken?> GetRefreshTokenByToken(string tokenString)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(tokenString))
                throw new ArgumentException("Token string cannot be null or empty", nameof(tokenString));

            using var db = new OverlutDbContext();
            return await db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenString);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-GetRefreshTokenByToken: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<RefreshToken>?> GetRefreshTokenByUserId(int userId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RefreshTokens.Where(x => x.UserId == userId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-GetRefreshTokenByUserId: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> DeleteRefreshTokenByToken(string tokenString)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(tokenString))
                throw new ArgumentException("Token string cannot be null or empty", nameof(tokenString));

            using var db = new OverlutDbContext();
            var token = await db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenString);
            if (token == null) return false;

            db.RefreshTokens.Remove(token);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-DeleteRefreshTokenByToken: {ex.Message}");
            return false;
        }
    }
}
