using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestsTypeDAO
{
    private readonly OverlutDbContext _db;

    public RescueRequestsTypeDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName)
    {
        try
        {
            
            var query = _db.RescueRequestsTypes.AsQueryable();

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

    public async Task<RescueRequestsType?> GetRescueRequestsTypeById(int id)
    {
        try
        {
            
            return await _db.RescueRequestsTypes.FirstOrDefaultAsync(x => x.RescueRequestsTypeId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-GetRescueRequestsTypeById: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueRequestsType?> CreateRescueRequestsType(RescueRequestsType rescueRequestsType)
    {
        try
        {
            if (rescueRequestsType == null)
                throw new ArgumentNullException(nameof(rescueRequestsType));

            if (string.IsNullOrWhiteSpace(rescueRequestsType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(rescueRequestsType));

            
            await _db.RescueRequestsTypes.AddAsync(rescueRequestsType);
            await _db.SaveChangesAsync();
            return rescueRequestsType;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-CreateRescueRequestsType: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueRequestsType(RescueRequestsType rescueRequestsType)
    {
        try
        {
            if (rescueRequestsType == null)
                throw new ArgumentNullException(nameof(rescueRequestsType));

            if (string.IsNullOrWhiteSpace(rescueRequestsType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(rescueRequestsType));

            
            var existingType = await _db.RescueRequestsTypes.FirstOrDefaultAsync(
                x => x.RescueRequestsTypeId == rescueRequestsType.RescueRequestsTypeId);

            if (existingType == null) return false;

            existingType.TypeName = rescueRequestsType.TypeName;
            _db.RescueRequestsTypes.Update(existingType);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-UpdateRescueRequestsType: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueRequestsTypeById(int id)
    {
        try
        {
            
            var rescueRequestsType = await _db.RescueRequestsTypes.FirstOrDefaultAsync(
                x => x.RescueRequestsTypeId == id);

            if (rescueRequestsType == null) return false;

            _db.RescueRequestsTypes.Remove(rescueRequestsType);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsTypeDAO-DeleteRescueRequestsTypeById: {ex.Message}");
            return false;
        }
    }
}
