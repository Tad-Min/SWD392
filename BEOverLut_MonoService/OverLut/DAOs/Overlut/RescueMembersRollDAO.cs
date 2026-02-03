using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMembersRollDAO
{
    public static async Task<IEnumerable<RescueMembersRoll>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueMembersRolls.AsQueryable();

            if (rescueMembersRollId.HasValue)
                query = query.Where(x => x.RescueMembersRollId == rescueMembersRollId.Value);

            if (!string.IsNullOrEmpty(rollName))
                query = query.Where(x => x.RollName.Contains(rollName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRollDAO-GetRescueMembersRolls: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueMembersRoll?> CreateRescueMembersRoll(RescueMembersRoll roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            using var db = new OverlutDbContext();
            await db.RescueMembersRolls.AddAsync(roll);
            await db.SaveChangesAsync();
            return roll;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRollDAO-CreateRescueMembersRoll: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueMembersRoll(RescueMembersRoll roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            using var db = new OverlutDbContext();
            var existingRoll = await db.RescueMembersRolls.FirstOrDefaultAsync(x => x.RescueMembersRollId == roll.RescueMembersRollId);
            if (existingRoll == null) return false;

            existingRoll.RollName = roll.RollName;
            db.RescueMembersRolls.Update(existingRoll);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRollDAO-UpdateRescueMembersRoll: {ex.Message}");
            return false;
        }
    }
}
