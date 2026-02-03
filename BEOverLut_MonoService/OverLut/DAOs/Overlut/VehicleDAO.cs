using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehicleDAO
{
    public static async Task<IEnumerable<Vehicle>?> GetAllVehicles(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.Vehicles.AsQueryable();
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

    public static async Task<Vehicle?> GetVehicleById(int vehicleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-GetVehicleById: {ex.Message}");
            return null;
        }
    }

    public static async Task<Vehicle?> AddVehicle(Vehicle vehicle)
    {
        try
        {
            if (vehicle == null)
                throw new ArgumentNullException(nameof(vehicle));
            using var db = new OverlutDbContext();
            await db.Vehicles.AddAsync(vehicle);
            await db.SaveChangesAsync();
            return vehicle;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-AddVehicle: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateVehicle(Vehicle vehicle)
    {
        try
        {
            if (vehicle == null)
                throw new ArgumentNullException(nameof(vehicle));
            using var db = new OverlutDbContext();
            var existingVehicle = await db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicle.VehicleId);
            if (existingVehicle == null)
                throw new Exception("Vehicle not found");
            existingVehicle.VehicleCode = vehicle.VehicleCode;
            existingVehicle.VehicleType = vehicle.VehicleType;
            existingVehicle.Capacity = vehicle.Capacity;
            existingVehicle.StatusId = vehicle.StatusId;
            existingVehicle.Note = vehicle.Note;
            db.Vehicles.Update(existingVehicle);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-UpdateVehicle: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteVehicleById(int vehicleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var vehicle = await db.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
            if (vehicle == null)
                throw new Exception("Vehicle not found");
            db.Vehicles.Remove(vehicle);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleDAO-DeleteVehicleById: {ex.Message}");
            return false;
        }
    }
}
