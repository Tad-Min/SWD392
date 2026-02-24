using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMembersRoleDAO
{
    public static async Task<IEnumerable<RescueMembersRole>?> GetRescueMembersRoles(int? rescueMembersRollId, string? rollName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueMembersRoles.AsQueryable();

            if (rescueMembersRollId.HasValue)
                query = query.Where(x => x.RescueMembersRoleId == rescueMembersRollId.Value);

            if (!string.IsNullOrEmpty(rollName))
                query = query.Where(x => x.RollName.Contains(rollName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-GetRescueMembersRoles: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            using var db = new OverlutDbContext();
            await db.RescueMembersRoles.AddAsync(roll);
            await db.SaveChangesAsync();
            return roll;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-CreateRescueMembersRole: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueMembersRole(RescueMembersRole roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            using var db = new OverlutDbContext();
            var existingRoll = await db.RescueMembersRoles.FirstOrDefaultAsync(x => x.RescueMembersRoleId == roll.RescueMembersRoleId);
            if (existingRoll == null) return false;

            existingRoll.RollName = roll.RollName;
            db.RescueMembersRoles.Update(existingRoll);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-UpdateRescueMembersRole: {ex.Message}");
            return false;
        }
    }
}
