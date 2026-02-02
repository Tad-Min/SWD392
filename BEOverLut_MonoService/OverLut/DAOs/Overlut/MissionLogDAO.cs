using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class MissionLogDAO
{
    public static async Task<MissionLog?> AddMissionLog(int missionId, string? oldRescueMissions, int changedByUserId)
    {
        using var db = new OverlutDbContext();
        var missionLog = new MissionLog
        {
            MissionId = missionId,
            OldRescueMissions = oldRescueMissions,
            ChangedByUserId = changedByUserId,
            ChangedAt = DateTime.UtcNow
        };
        await db.MissionLogs.AddAsync(missionLog);
        await db.SaveChangesAsync();
        return missionLog;
    }

    public static async Task<IEnumerable<MissionLog>> GetMissionLogByMissionId(int missionId)
    {
        using var db = new OverlutDbContext();
        return await db.MissionLogs
            .Where(x => x.MissionId == missionId)
            .OrderByDescending(x => x.ChangedAt)
            .ToListAsync();
    }

    public static async Task<IEnumerable<MissionLog>> GetMissionLogByUserId(int userId)
    {
        using var db = new OverlutDbContext();
        return await db.MissionLogs
            .Where(x => x.ChangedByUserId == userId)
            .OrderByDescending(x => x.ChangedAt)
            .ToListAsync();
    }
}
