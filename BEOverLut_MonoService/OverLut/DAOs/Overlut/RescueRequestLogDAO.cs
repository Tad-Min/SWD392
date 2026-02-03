using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestLogDAO
{
    public static async Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog)
    {
        try
        {
            if (rescueRequestLog == null)
                throw new ArgumentNullException(nameof(rescueRequestLog));

            using var db = new OverlutDbContext();
            rescueRequestLog.ChangedAt = DateTime.UtcNow;
            await db.RescueRequestLogs.AddAsync(rescueRequestLog);
            await db.SaveChangesAsync();
            return rescueRequestLog;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestLogDAO-AddRescueRequestLog: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueRequestLogs
                .Where(x => x.RescueRequestId == rescueRequestId)
                .OrderByDescending(x => x.ChangedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestLogDAO-GetRescueRequestLogByRescueRequestId: {ex.Message}");
            return null;
        }
    }
}
