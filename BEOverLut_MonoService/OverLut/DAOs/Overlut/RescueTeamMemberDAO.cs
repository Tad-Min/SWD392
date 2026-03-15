using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamMemberDAO
{
    private readonly OverlutDbContext _db;

    public RescueTeamMemberDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueTeamMember>?> GetAllRescueTeamMembersWithTeamId(int teamId)
    {
        try
        {
            
            return await _db.RescueTeamMembers
                .Where(x => x.TeamId == teamId)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-GetAllRescueTeamMembersWithTeamId: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueTeamMember?> GetRescueTeamMemberByUserIdAndTeamId(int userId, int teamId)
    {
        
        return await _db.RescueTeamMembers
            .FirstOrDefaultAsync(x => x.UserId == userId && x.TeamId == teamId);
    }
    public async Task<RescueTeamMember?> AddRescueTeamMember(RescueTeamMember rescueTeamMember)
    {
        try
        {
            if (rescueTeamMember == null)
                throw new ArgumentNullException(nameof(rescueTeamMember));
            
            await _db.RescueTeamMembers.AddAsync(rescueTeamMember);
            await _db.SaveChangesAsync();
            return rescueTeamMember;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-AddRescueTeamMember: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueTeamMember(RescueTeamMember rescueTeamMember)
    {
        try
        {
            if (rescueTeamMember == null)
                throw new ArgumentNullException(nameof(rescueTeamMember));
            
            var existingMember = await _db.RescueTeamMembers.FirstOrDefaultAsync(x => x.UserId == rescueTeamMember.UserId && x.TeamId == rescueTeamMember.TeamId);
            if (existingMember == null)
                throw new Exception("RescueTeamMember not found");
            existingMember.RoleId = rescueTeamMember.RoleId;
            _db.RescueTeamMembers.Update(existingMember);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-UpdateRescueTeamMember: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueTeamMember(int userId, int teamId)
    {
        try
        {
            
            var rescueTeamMember = await _db.RescueTeamMembers.FirstOrDefaultAsync(x => x.UserId == userId && x.TeamId == teamId);
            if (rescueTeamMember == null)
                throw new Exception("RescueTeamMember not found");
            _db.RescueTeamMembers.Remove(rescueTeamMember);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-DeleteRescueTeamMember: {ex.Message}");
            return false;
        }
    }
}
