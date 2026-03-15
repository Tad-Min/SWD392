using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RefreshTokenDAO
{
    private readonly OverlutDbContext _db;

    public RefreshTokenDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RefreshToken>?> GetAllActivedRefreshTokenByUserId(int UserId)
    {
        try
        {
            
            return await _db.RefreshTokens.Where(x => x.UserId == UserId && !x.Revoked).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-GetAllActivedRefreshTokenByUserId: {ex.Message}, Inner: {ex.InnerException?.Message}");
            return null;
        }
    }
    public async Task<RefreshToken?> CreateRefreshToken(RefreshToken refreshToken)
    {
        try
        {
            if (refreshToken == null)
                throw new ArgumentNullException(nameof(refreshToken));

            
            refreshToken.Revoked = false;
            await _db.RefreshTokens.AddAsync(refreshToken);
            await _db.SaveChangesAsync();
            return refreshToken;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-CreateRefreshToken: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> RevokeToken(RefreshToken refreshToken)
    {
        try
        {
            

            _db.RefreshTokens.Attach(refreshToken);

            refreshToken.Revoked = true;
            refreshToken.ExpiredAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-RevokeToken: {ex.Message}, Inner: {ex.InnerException?.Message}");
            return false;
        }
    }

    public async Task<RefreshToken?> GetRefreshTokenByUserIdAndToken(int userId, string token)
    {
        try
        {
            
            return await _db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token && x.UserId == userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-GetRefreshTokenByUserIdAndToken: {ex.Message}");
            return null;
        }
    }
    public async Task<IEnumerable<RefreshToken>?> GetRefreshTokenByUserId(int userId)
    {
        try
        {
            
            return await _db.RefreshTokens.Where(x => x.UserId == userId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-GetRefreshTokenByUserId: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> DeleteRefreshTokenByToken(string tokenString)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(tokenString))
                throw new ArgumentException("Token string cannot be null or empty", nameof(tokenString));

            
            var token = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == tokenString);
            if (token == null) return false;

            _db.RefreshTokens.Remove(token);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RefreshTokenDAO-DeleteRefreshTokenByToken: {ex.Message}");
            return false;
        }
    }
}
