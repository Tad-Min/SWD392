using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestLogDAO
{
    private readonly OverlutDbContext _db;

    public RescueRequestLogDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog)
    {
        try
        {
            if (rescueRequestLog == null)
                throw new ArgumentNullException(nameof(rescueRequestLog));

            
            rescueRequestLog.ChangedAt = DateTime.UtcNow;
            await _db.RescueRequestLogs.AddAsync(rescueRequestLog);
            await _db.SaveChangesAsync();
            return rescueRequestLog;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestLogDAO-AddRescueRequestLog: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId)
    {
        try
        {
            
            return await _db.RescueRequestLogs
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

    public async Task<IEnumerable<RescueRequestLog>?> GetAllRescueRequestLogs()
    {
        try
        {
            
            return await _db.RescueRequestLogs
                .OrderByDescending(x => x.ChangedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestLogDAO-GetAllRescueRequestLogs: {ex.Message}");
            return null;
        }
    }
}
