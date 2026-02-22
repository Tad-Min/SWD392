using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestsTypeDAO
{
    public static async Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueRequestsTypes.AsQueryable();

            if (!string.IsNullOrEmpty(typeName))
                query = query.Where(x => x.TypeName.Contains(typeName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-GetAllRescueRequestsType: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueRequestsType?> GetRescueRequestsTypeById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueRequestsTypes.FirstOrDefaultAsync(x => x.RescueRequestsTypeId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-GetRescueRequestsTypeById: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueRequestsType?> CreateRescueRequestsType(RescueRequestsType rescueRequestsType)
    {
        try
        {
            if (rescueRequestsType == null)
                throw new ArgumentNullException(nameof(rescueRequestsType));

            if (string.IsNullOrWhiteSpace(rescueRequestsType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(rescueRequestsType));

            using var db = new OverlutDbContext();
            await db.RescueRequestsTypes.AddAsync(rescueRequestsType);
            await db.SaveChangesAsync();
            return rescueRequestsType;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-CreateRescueRequestsType: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueRequestsType(RescueRequestsType rescueRequestsType)
    {
        try
        {
            if (rescueRequestsType == null)
                throw new ArgumentNullException(nameof(rescueRequestsType));

            if (string.IsNullOrWhiteSpace(rescueRequestsType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(rescueRequestsType));

            using var db = new OverlutDbContext();
            var existingType = await db.RescueRequestsTypes.FirstOrDefaultAsync(
                x => x.RescueRequestsTypeId == rescueRequestsType.RescueRequestsTypeId);

            if (existingType == null) return false;

            existingType.TypeName = rescueRequestsType.TypeName;
            db.RescueRequestsTypes.Update(existingType);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-UpdateRescueRequestsType: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueRequestsTypeById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var rescueRequestsType = await db.RescueRequestsTypes.FirstOrDefaultAsync(
                x => x.RescueRequestsTypeId == id);

            if (rescueRequestsType == null) return false;

            db.RescueRequestsTypes.Remove(rescueRequestsType);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-DeleteRescueRequestsTypeById: {ex.Message}");
            return false;
        }
    }
}
