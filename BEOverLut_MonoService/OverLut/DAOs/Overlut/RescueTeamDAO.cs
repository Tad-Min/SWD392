using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamDAO
{
    private readonly OverlutDbContext _db;

    public RescueTeamDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueTeam>?> GetAllRescueTeam(int? teamId = null, string? teamName = null, int? statusId = null)
    {
        try
        {
            
            var query = _db.RescueTeams.AsQueryable();
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
    public async Task<RescueTeam?> GetRescueTeamByTeamId(int teamId)
    {
        try
        {
            
            return await _db.RescueTeams
                .FirstOrDefaultAsync(e => e.TeamId == teamId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-GetRescueTeamByTeamId: {ex.Message}");
            return null;
        }
    }
    public async Task<IEnumerable<RescueTeam>?> GetRescueTeamByUserId(int userId)
    {
        try
        {
            
            return await _db.RescueTeams
                .AsNoTracking()
                .Where(e => e.RescueTeamMembers.Any(x => x.UserId == userId) && e.IsActive)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-GetRescueTeamByUserId: {ex.Message}");
            return null;
        }
    }


    public async Task<RescueTeam?> CreateRescueTeam(RescueTeam rescueTeam)
    {
        try
        {
            if (rescueTeam == null)
                throw new ArgumentNullException(nameof(rescueTeam));
            
            rescueTeam.CreatedAt = DateTime.UtcNow;
            await _db.RescueTeams.AddAsync(rescueTeam);
            await _db.SaveChangesAsync();
            return rescueTeam;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-CreateRescueTeam: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueTeam(RescueTeam rescueTeam)
    {
        try
        {
            if (rescueTeam == null)
                throw new ArgumentNullException(nameof(rescueTeam));
            
            var existingTeam = await _db.RescueTeams.FirstOrDefaultAsync(x => x.TeamId == rescueTeam.TeamId);
            if (existingTeam == null)
                throw new Exception("RescueTeam not found");
            existingTeam.TeamName = rescueTeam.TeamName;
            existingTeam.StatusId = rescueTeam.StatusId;
            _db.RescueTeams.Update(existingTeam);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-UpdateRescueTeam: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueTeamById(int teamId)
    {
        try
        {
            
            var rescueTeam = await _db.RescueTeams.FirstOrDefaultAsync(x => x.TeamId == teamId);
            if (rescueTeam == null)
                throw new Exception("RescueTeam not found");
            _db.RescueTeams.Remove(rescueTeam);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamDAO-DeleteRescueTeamById: {ex.Message}");
            return false;
        }
    }
}
