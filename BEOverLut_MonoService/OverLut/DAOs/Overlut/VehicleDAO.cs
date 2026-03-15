using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehicleDAO
{
    private readonly OverlutDbContext _db;

    public VehicleDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<Vehicle>?> GetAllVehicles(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null)
    {
        try
        {
            
            var query = _db.Vehicles.AsQueryable();
            if (vehicleId.HasValue) query = query.Where(x => x.VehicleId == vehicleId.Value);
            if (!string.IsNullOrEmpty(vehicleCode)) query = query.Where(x => x.VehicleCode.Contains(vehicleCode));
            if (vehicleType.HasValue) query = query.Where(x => x.VehicleType == vehicleType.Value);
            if (capacity.HasValue) query = query.Where(x => x.Capacity == capacity.Value);
            if (statusId.HasValue) query = query.Where(x => x.StatusId == statusId.Value);
            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-GetAllVehicles: {ex.Message}");
            return null;
        }
    }

    public async Task<Vehicle?> GetVehicleById(int vehicleId)
    {
        try
        {
            
            return await _db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-GetVehicleById: {ex.Message}");
            return null;
        }
    }

    public async Task<Vehicle?> AddVehicle(Vehicle vehicle)
    {
        try
        {
            if (vehicle == null)
                throw new ArgumentNullException(nameof(vehicle));
            
            await _db.Vehicles.AddAsync(vehicle);
            await _db.SaveChangesAsync();
            return vehicle;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-AddVehicle: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateVehicle(Vehicle vehicle)
    {
        try
        {
            if (vehicle == null)
                throw new ArgumentNullException(nameof(vehicle));
            
            var existingVehicle = await _db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicle.VehicleId);
            if (existingVehicle == null)
                throw new Exception("Vehicle not found");
            existingVehicle.VehicleCode = vehicle.VehicleCode;
            existingVehicle.VehicleType = vehicle.VehicleType;
            existingVehicle.Capacity = vehicle.Capacity;
            existingVehicle.StatusId = vehicle.StatusId;
            existingVehicle.Note = vehicle.Note;
            _db.Vehicles.Update(existingVehicle);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-UpdateVehicle: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteVehicleById(int vehicleId)
    {
        try
        {
            
            var vehicle = await _db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
            if (vehicle == null)
                throw new Exception("Vehicle not found");
            _db.Vehicles.Remove(vehicle);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-DeleteVehicleById: {ex.Message}");
            return false;
        }
    }
}
