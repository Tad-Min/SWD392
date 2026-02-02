using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMissionDAO
{
    public static async Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId)
    {
        using var db = new OverlutDbContext();
        var query = db.RescueMissions.AsQueryable();

        if (missionId.HasValue)
            query = query.Where(x => x.MissionId == missionId.Value);

        if (rescueRequestId.HasValue)
            query = query.Where(x => x.RescueRequestId == rescueRequestId.Value);

        if (coordinatorUserId.HasValue)
            query = query.Where(x => x.CoordinatorUserId == coordinatorUserId.Value);

        if (teamId.HasValue)
            query = query.Where(x => x.TeamId == teamId.Value);

        if (statusId.HasValue)
            query = query.Where(x => x.StatusId == statusId.Value);

        return await query.ToListAsync();
    }

    public static async Task<RescueMission?> CreateRescueMission(int rescueRequestId, int coordinatorUserId, int teamId, int statusId)
    {
        using var db = new OverlutDbContext();
        var mission = new RescueMission
        {
            RescueRequestId = rescueRequestId,
            CoordinatorUserId = coordinatorUserId,
            TeamId = teamId,
            StatusId = statusId,
        };
        await db.RescueMissions.AddAsync(mission);
        await db.SaveChangesAsync();
        return mission;
    }

    public static async Task<bool> UpdateRescueMission(int missionId, int rescueRequestId, int coordinatorUserId, int teamId, int statusId)
    {
        using var db = new OverlutDbContext();
        var mission = await db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == missionId);
        if (mission == null) return false;

        mission.RescueRequestId = rescueRequestId;
        mission.CoordinatorUserId = coordinatorUserId;
        mission.TeamId = teamId;
        mission.StatusId = statusId;
        db.RescueMissions.Update(mission);
        await db.SaveChangesAsync();
        return true;
    }

    public static async Task<bool> DeleteRescueMission(int missionId)
    {
        using var db = new OverlutDbContext();
        var mission = await db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == missionId);
        if (mission == null) return false;

        db.RescueMissions.Remove(mission);
        await db.SaveChangesAsync();
        return true;
    }
}
