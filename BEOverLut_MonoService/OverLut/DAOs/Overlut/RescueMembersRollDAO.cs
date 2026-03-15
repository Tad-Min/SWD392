using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMembersRoleDAO
{
    private readonly OverlutDbContext _db;

    public RescueMembersRoleDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueMembersRole>?> GetAllRescueMembersRoles()
    {
        try
        {
            
            return await _db.RescueMembersRoles.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-GetRescueMembersRoles: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueMembersRole?> GetRescueMembersRoleById(int id)
    {
        try
        {
            
            return await _db.RescueMembersRoles.FirstOrDefaultAsync(x => x.RescueMembersRoleId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-GetRescueMembersRoleById: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            
            await _db.RescueMembersRoles.AddAsync(roll);
            await _db.SaveChangesAsync();
            return roll;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-CreateRescueMembersRole: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueMembersRole(RescueMembersRole roll)
    {
        try
        {
            if (roll == null)
                throw new ArgumentNullException(nameof(roll));

            
            var existingRoll = await _db.RescueMembersRoles.FirstOrDefaultAsync(x => x.RescueMembersRoleId == roll.RescueMembersRoleId);
            if (existingRoll == null) return false;

            existingRoll.RoleName = roll.RoleName;
            _db.RescueMembersRoles.Update(existingRoll);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-UpdateRescueMembersRole: {ex.Message}");
            return false;
        }
    }
    public async Task<bool> DeleteRescueMembersRoleById(int id)
    {
        try
        {
            
            var existingRoll = await _db.RescueMembersRoles.FirstOrDefaultAsync(x => x.RescueMembersRoleId == id);
            if (existingRoll == null) return false;
            _db.RescueMembersRoles.Remove(existingRoll);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMembersRoleDAO-DeleteRescueMembersRoleById: {ex.Message}");
            return false;
        }
    }
}
