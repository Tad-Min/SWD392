using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehiclesTypeDAO
{
    private readonly OverlutDbContext _db;

    public VehiclesTypeDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName)
    {
        try
        {
            
            var query = _db.VehiclesTypes.AsQueryable();

            if (!string.IsNullOrEmpty(typeName))
                query = query.Where(x => x.TypeName.Contains(typeName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-GetAllVehiclesType: {ex.Message}");
            return null;
        }
    }

    public async Task<VehiclesType?> GetVehiclesTypeById(int id)
    {
        try
        {
            
            return await _db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-GetVehiclesTypeById: {ex.Message}");
            return null;
        }
    }

    public async Task<VehiclesType?> CreateVehiclesType(VehiclesType vehiclesType)
    {
        try
        {
            if (vehiclesType == null)
                throw new ArgumentNullException(nameof(vehiclesType));

            if (string.IsNullOrWhiteSpace(vehiclesType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(vehiclesType));

            
            await _db.VehiclesTypes.AddAsync(vehiclesType);
            await _db.SaveChangesAsync();
            return vehiclesType;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-CreateVehiclesType: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateVehiclesType(VehiclesType vehiclesType)
    {
        try
        {
            if (vehiclesType == null)
                throw new ArgumentNullException(nameof(vehiclesType));

            if (string.IsNullOrWhiteSpace(vehiclesType.TypeName))
                throw new ArgumentException("TypeName cannot be null or empty", nameof(vehiclesType));

            
            var existingType = await _db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == vehiclesType.VehicleTypeId);

            if (existingType == null) return false;

            existingType.TypeName = vehiclesType.TypeName;
            _db.VehiclesTypes.Update(existingType);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-UpdateVehiclesType: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteVehiclesTypeById(int id)
    {
        try
        {
            
            var vehiclesType = await _db.VehiclesTypes.FirstOrDefaultAsync(x => x.VehicleTypeId == id);

            if (vehiclesType == null) return false;

            _db.VehiclesTypes.Remove(vehiclesType);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesTypeDAO-DeleteVehiclesTypeById: {ex.Message}");
            return false;
        }
    }
}
