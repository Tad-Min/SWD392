using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class MissionLogDAO
{
    public static async Task<MissionLog?> AddMissionLog(MissionLog missionLog)
    {
        try
        {
            if (missionLog == null)
                throw new ArgumentNullException(nameof(missionLog));

            using var db = new OverlutDbContext();
            missionLog.ChangedAt = DateTime.UtcNow;
            await db.MissionLogs.AddAsync(missionLog);
            await db.SaveChangesAsync();
            return missionLog;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MissionLogDAO-AddMissionLog: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.MissionLogs
                .Where(x => x.MissionId == missionId)
                .OrderByDescending(x => x.ChangedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MissionLogDAO-GetMissionLogByMissionId: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<MissionLog>?> GetMissionLogByUserId(int userId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.MissionLogs
                .Where(x => x.ChangedByUserId == userId)
                .OrderByDescending(x => x.ChangedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MissionLogDAO-GetMissionLogByUserId: {ex.Message}");
            return null;
        }
    }
}
