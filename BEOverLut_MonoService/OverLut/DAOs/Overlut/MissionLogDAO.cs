using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class MissionLogDAO
{
    private readonly OverlutDbContext _db;

    public MissionLogDAO(OverlutDbContext db)
    {
        _db = db;
    }

    public async Task<MissionLog?> AddMissionLog(MissionLog missionLog)
    {
        try
        {
            if (missionLog == null)
                throw new ArgumentNullException(nameof(missionLog));

            
            missionLog.ChangedAt = DateTime.UtcNow;
            await _db.MissionLogs.AddAsync(missionLog);
            await _db.SaveChangesAsync();
            return missionLog;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MissionLogDAO-AddMissionLog: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId)
    {
        try
        {
            
            return await _db.MissionLogs
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

    public async Task<IEnumerable<MissionLog>?> GetMissionLogByUserId(int userId)
    {
        try
        {
            
            return await _db.MissionLogs
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

    public async Task<IEnumerable<MissionLog>?> GetAllMissionLogs()
    {
        try
        {
            
            return await _db.MissionLogs
                .OrderByDescending(x => x.ChangedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MissionLogDAO-GetAllMissionLogs: {ex.Message}");
            return null;
        }
    }
}
