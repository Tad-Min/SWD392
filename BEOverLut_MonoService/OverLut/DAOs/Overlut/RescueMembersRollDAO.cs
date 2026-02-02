using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMembersRollDAO
{
    public static async Task<IEnumerable<RescueMembersRoll>> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName)
    {
        using var db = new OverlutDbContext();
        var query = db.RescueMembersRolls.AsQueryable();

        if (rescueMembersRollId.HasValue)
            query = query.Where(x => x.RescueMembersRollId == rescueMembersRollId.Value);

        if (!string.IsNullOrEmpty(rollName))
            query = query.Where(x => x.RollName.Contains(rollName));

        return await query.ToListAsync();
    }

    public static async Task<RescueMembersRoll?> CreateRescueMembersRoll(string rollName)
    {
        using var db = new OverlutDbContext();
        var roll = new RescueMembersRoll
        {
            RollName = rollName
        };
        await db.RescueMembersRolls.AddAsync(roll);
        await db.SaveChangesAsync();
        return roll;
    }

    public static async Task<bool> UpdateRescueMembersRoll(int rescueMembersRollId, string rollName)
    {
        using var db = new OverlutDbContext();
        var roll = await db.RescueMembersRolls.FirstOrDefaultAsync(x => x.RescueMembersRollId == rescueMembersRollId);
        if (roll == null) return false;

        roll.RollName = rollName;
        db.RescueMembersRolls.Update(roll);
        await db.SaveChangesAsync();
        return true;
    }
}
