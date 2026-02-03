using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamMemberDAO
{
    public static async Task<IEnumerable<RescueTeamMember>?> GetAllRescueTeamMembersWithTeamId(int teamId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueTeamMembers
                .Where(x => x.TeamId == teamId)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-GetAllRescueTeamMembersWithTeamId: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueTeamMember?> AddRescueTeamMember(RescueTeamMember rescueTeamMember)
    {
        try
        {
            if (rescueTeamMember == null)
                throw new ArgumentNullException(nameof(rescueTeamMember));
            using var db = new OverlutDbContext();
            await db.RescueTeamMembers.AddAsync(rescueTeamMember);
            await db.SaveChangesAsync();
            return rescueTeamMember;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-AddRescueTeamMember: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueTeamMember(RescueTeamMember rescueTeamMember)
    {
        try
        {
            if (rescueTeamMember == null)
                throw new ArgumentNullException(nameof(rescueTeamMember));
            using var db = new OverlutDbContext();
            var existingMember = await db.RescueTeamMembers.FirstOrDefaultAsync(x => x.UserId == rescueTeamMember.UserId && x.TeamId == rescueTeamMember.TeamId);
            if (existingMember == null)
                throw new Exception("RescueTeamMember not found");
            existingMember.RoleId = rescueTeamMember.RoleId;
            db.RescueTeamMembers.Update(existingMember);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-UpdateRescueTeamMember: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueTeamMember(int userId, int teamId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var rescueTeamMember = await db.RescueTeamMembers.FirstOrDefaultAsync(x => x.UserId == userId && x.TeamId == teamId);
            if (rescueTeamMember == null)
                throw new Exception("RescueTeamMember not found");
            db.RescueTeamMembers.Remove(rescueTeamMember);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamMemberDAO-DeleteRescueTeamMember: {ex.Message}");
            return false;
        }
    }
}
