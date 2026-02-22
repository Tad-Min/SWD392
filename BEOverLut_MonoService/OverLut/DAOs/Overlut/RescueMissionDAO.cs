using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMissionDAO
{
    public static async Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description)
    {
        try
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

            if (!string.IsNullOrEmpty(description))
                query = query.Where(x => x.Description != null && x.Description.Contains(description));
            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-GetAllRescueMission: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueMission?> CreateRescueMission(RescueMission mission)
    {
        try
        {
            if (mission == null)
                throw new ArgumentNullException(nameof(mission));

            using var db = new OverlutDbContext();
            mission.AssignedAt = DateTime.UtcNow;
            await db.RescueMissions.AddAsync(mission);
            await db.SaveChangesAsync();
            return mission;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-CreateRescueMission: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueMission(RescueMission mission)
    {
        try
        {
            if (mission == null)
                throw new ArgumentNullException(nameof(mission));

            using var db = new OverlutDbContext();
            var existingMission = await db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == mission.MissionId);
            if (existingMission == null) return false;

            existingMission.RescueRequestId = mission.RescueRequestId;
            existingMission.CoordinatorUserId = mission.CoordinatorUserId;
            existingMission.TeamId = mission.TeamId;
            existingMission.StatusId = mission.StatusId;

            db.RescueMissions.Update(existingMission);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-UpdateRescueMission: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueMission(int missionId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var mission = await db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == missionId);
            if (mission == null) return false;

            db.RescueMissions.Remove(mission);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-DeleteRescueMission: {ex.Message}");
            return false;
        }
    }
}
