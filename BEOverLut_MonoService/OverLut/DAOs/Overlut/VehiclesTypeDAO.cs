using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehiclesTypeDAO
{
    public static async Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.VehiclesTypes.AsQueryable();

            if (!string.IsNullOrEmpty(typeName))
                query = query.Where(x => x.TypeName.Contains(typeName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-GetAllVehiclesType: {ex.Message}");
            return null;
        }
    }

    public static async Task<VehiclesType?> GetVehiclesTypeById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-GetVehiclesTypeById: {ex.Message}");
            return null;
        }
    }

    public static async Task<VehiclesType?> CreateVehiclesType(VehiclesType vehiclesType)
    {
        try
        {
            if (vehiclesType == null)
                throw new ArgumentNullException(nameof(vehiclesType));

            if (string.IsNullOrWhiteSpace(vehiclesType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(vehiclesType));

            using var db = new OverlutDbContext();
            await db.VehiclesTypes.AddAsync(vehiclesType);
            await db.SaveChangesAsync();
            return vehiclesType;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-CreateVehiclesType: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateVehiclesType(VehiclesType vehiclesType)
    {
        try
        {
            if (vehiclesType == null)
                throw new ArgumentNullException(nameof(vehiclesType));

            if (string.IsNullOrWhiteSpace(vehiclesType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(vehiclesType));

            using var db = new OverlutDbContext();
            var existingType = await db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == vehiclesType.VehicleTypeId);

            if (existingType == null) return false;

            existingType.TypeName = vehiclesType.TypeName;
            db.VehiclesTypes.Update(existingType);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-UpdateVehiclesType: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteVehiclesTypeById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var vehiclesType = await db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == id);

            if (vehiclesType == null) return false;

            db.VehiclesTypes.Remove(vehiclesType);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-DeleteVehiclesTypeById: {ex.Message}");
            return false;
        }
    }
}
