using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMissionDAO
{
    private readonly OverlutDbContext _db;

    public RescueMissionDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description)
    {
        try
        {
            
            var query = _db.RescueMissions.AsQueryable();

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

    public async Task<RescueMission?> CreateRescueMission(RescueMission mission)
    {
        try
        {
            if (mission == null)
                throw new ArgumentNullException(nameof(mission));

            
            mission.AssignedAt = DateTime.UtcNow;
            await _db.RescueMissions.AddAsync(mission);
            await _db.SaveChangesAsync();
            return mission;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-CreateRescueMission: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueMission(RescueMission mission)
    {
        try
        {
            if (mission == null)
                throw new ArgumentNullException(nameof(mission));

            
            var existingMission = await _db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == mission.MissionId);
            if (existingMission == null) return false;

            existingMission.RescueRequestId = mission.RescueRequestId;
            existingMission.CoordinatorUserId = mission.CoordinatorUserId;
            existingMission.TeamId = mission.TeamId;
            existingMission.StatusId = mission.StatusId;

            _db.RescueMissions.Update(existingMission);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-UpdateRescueMission: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueMission(int missionId)
    {
        try
        {
            
            var mission = await _db.RescueMissions.FirstOrDefaultAsync(x => x.MissionId == missionId);
            if (mission == null) return false;

            _db.RescueMissions.Remove(mission);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionDAO-DeleteRescueMission: {ex.Message}");
            return false;
        }
    }
}
