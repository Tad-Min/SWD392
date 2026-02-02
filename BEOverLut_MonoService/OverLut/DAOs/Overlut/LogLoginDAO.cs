using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class LogLoginDAO
{
    public static async Task<LogLogin?> CreateLogLogin(int? refreshTokenId, bool success, string? failReason, string? ipAddress, string? userAgent)
    {
        using var db = new OverlutDbContext();
        var logLogin = new LogLogin
        {
            RefreshTokenId = refreshTokenId,
            Success = success,
            FailReason = failReason,
            Ipaddress = ipAddress,
            UserAgent = userAgent,
            LoginTime = DateTime.UtcNow
        };
        await db.LogLogins.AddAsync(logLogin);
        await db.SaveChangesAsync();
        return logLogin;
    }

    public static async Task<IEnumerable<LogLogin>> GetLogLoginByUserId(int userId)
    {
        using var db = new OverlutDbContext();
        return await db.LogLogins
            .Where(x => x.RefreshToken != null && x.RefreshToken.UserId == userId)
            .OrderByDescending(x => x.LoginTime)
            .ToListAsync();
    }
}
