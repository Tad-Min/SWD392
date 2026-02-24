using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehicleAssignmentDAO
{
    public static async Task<IEnumerable<VehicleAssignment>?> GetAllVehicleAssignment(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.VehicleAssignments.AsQueryable();
            if (missionId.HasValue) query = query.Where(x => x.MissionId == missionId.Value);
            if (vehicleId.HasValue) query = query.Where(x => x.VehicleId == vehicleId.Value);
            if (assignedAt.HasValue) query = query.Where(x => x.AssignedAt == assignedAt.Value);
            if (releasedAt.HasValue) query = query.Where(x => x.ReleasedAt == releasedAt.Value);
            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-GetAllVehicleAssignment: {ex.Message}");
            return null;
        }
    }

    public static async Task<VehicleAssignment?> GetVehicleAssignmentById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.VehicleAssignments.FirstOrDefaultAsync(v => v.VehicleId == id);
        }
        catch(Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-GetVehicleAssignmentById: {ex.Message}");
            return null;
        }
    }
    public static async Task<IEnumerable<VehicleAssignment>?> GetVehicleAssignmentByMissionId(int missionId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.VehicleAssignments.Where(x => x.MissionId == missionId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-GetVehicleAssignmentByMissionId: {ex.Message}");
            return null;
        }
    }


    public static async Task<VehicleAssignment?> AddVehicleAssignment(VehicleAssignment vehicleAssignment)
    {
        try
        {
            if (vehicleAssignment == null)
                throw new ArgumentNullException(nameof(vehicleAssignment));
            using var db = new OverlutDbContext();
            await db.VehicleAssignments.AddAsync(vehicleAssignment);
            await db.SaveChangesAsync();
            return vehicleAssignment;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-AddVehicleAssignment: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateVehicleAssignment(VehicleAssignment vehicleAssignment)
    {
        try
        {
            if (vehicleAssignment == null)
                throw new ArgumentNullException(nameof(vehicleAssignment));
            using var db = new OverlutDbContext();
            var existingAssignment = await db.VehicleAssignments.FirstOrDefaultAsync(x => x.MissionId == vehicleAssignment.MissionId && x.VehicleId == vehicleAssignment.VehicleId);
            if (existingAssignment == null)
                throw new Exception("VehicleAssignment not found");
            existingAssignment.AssignedAt = vehicleAssignment.AssignedAt;
            existingAssignment.ReleasedAt = vehicleAssignment.ReleasedAt;
            db.VehicleAssignments.Update(existingAssignment);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-UpdateVehicleAssignment: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteVehicleAssignmentById(int missionId, int vehicleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var vehicleAssignment = await db.VehicleAssignments.FirstOrDefaultAsync(x => x.MissionId == missionId && x.VehicleId == vehicleId);
            if (vehicleAssignment == null)
                throw new Exception("VehicleAssignment not found");
            db.VehicleAssignments.Remove(vehicleAssignment);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-DeleteVehicleAssignmentById: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> IsVehicleRelease(int vehicleId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return !await db.VehicleAssignments.AnyAsync(x => x.VehicleId == vehicleId && x.ReleasedAt == null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-IsVehicleRelease: {ex.Message}");
            return false;
        }
    }
}
