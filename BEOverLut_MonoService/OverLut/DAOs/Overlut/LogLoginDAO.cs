using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class LogLoginDAO
{
    public static async Task<LogLogin?> CreateLogLogin(LogLogin logLogin)
    {
        try
        {
            if (logLogin == null)
                throw new ArgumentNullException(nameof(logLogin));

            using var db = new OverlutDbContext();
            logLogin.LoginTime = DateTime.UtcNow;
            await db.LogLogins.AddAsync(logLogin);
            await db.SaveChangesAsync();
            return logLogin;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"LogLoginDAO-CreateLogLogin: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<LogLogin>?> GetLogLoginByUserId(int userId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.LogLogins
                .Where(x => x.RefreshToken != null && x.RefreshToken.UserId == userId)
                .OrderByDescending(x => x.LoginTime)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"LogLoginDAO-GetLogLoginByUserId: {ex.Message}");
            return null;
        }
    }
}
