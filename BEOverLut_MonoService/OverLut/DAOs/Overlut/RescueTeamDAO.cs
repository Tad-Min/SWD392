using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamDAO
{
    public static async Task<IEnumerable<RescueTeam>?> GetAllRescueTeam(int? teamId = null, string? teamName = null, int? statusId = null)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueTeams.AsQueryable();
            if (teamId.HasValue) query = query.Where(x => x.TeamId == teamId.Value);
            if (!string.IsNullOrEmpty(teamName)) query = query.Where(x => x.TeamName.Contains(teamName));
            if (statusId.HasValue) query = query.Where(x => x.StatusId == statusId.Value);
            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-GetAllRescueTeam: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueTeam?> CreateRescueTeam(RescueTeam rescueTeam)
    {
        try
        {
            if (rescueTeam == null)
                throw new ArgumentNullException(nameof(rescueTeam));
            using var db = new OverlutDbContext();
            rescueTeam.CreatedAt = DateTime.UtcNow;
            await db.RescueTeams.AddAsync(rescueTeam);
            await db.SaveChangesAsync();
            return rescueTeam;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-CreateRescueTeam: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueTeam(RescueTeam rescueTeam)
    {
        try
        {
            if (rescueTeam == null)
                throw new ArgumentNullException(nameof(rescueTeam));
            using var db = new OverlutDbContext();
            var existingTeam = await db.RescueTeams.FirstOrDefaultAsync(x => x.TeamId == rescueTeam.TeamId);
            if (existingTeam == null)
                throw new Exception("RescueTeam not found");
            existingTeam.TeamName = rescueTeam.TeamName;
            existingTeam.StatusId = rescueTeam.StatusId;
            db.RescueTeams.Update(existingTeam);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-UpdateRescueTeam: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueTeamById(int teamId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var rescueTeam = await db.RescueTeams.FirstOrDefaultAsync(x => x.TeamId == teamId);
            if (rescueTeam == null)
                throw new Exception("RescueTeam not found");
            db.RescueTeams.Remove(rescueTeam);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-DeleteRescueTeamById: {ex.Message}");
            return false;
        }
    }
}
