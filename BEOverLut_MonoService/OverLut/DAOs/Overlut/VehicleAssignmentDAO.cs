using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehicleAssignmentDAO
{
    private readonly OverlutDbContext _db;

    public VehicleAssignmentDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<VehicleAssignment>?> GetAllVehicleAssignment(int? missionId = null, int? vehicleId = null, DateTime? assignedAt = null, DateTime? releasedAt = null)
    {
        try
        {
            
            var query = _db.VehicleAssignments.AsQueryable();
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

    public async Task<VehicleAssignment?> GetVehicleAssignmentById(int id)
    {
        try
        {
            
            return await _db.VehicleAssignments.FirstOrDefaultAsync(v => v.VehicleId == id);
        }
        catch(Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-GetVehicleAssignmentById: {ex.Message}");
            return null;
        }
    }
    public async Task<IEnumerable<VehicleAssignment>?> GetVehicleAssignmentByMissionId(int missionId)
    {
        try
        {
            
            return await _db.VehicleAssignments.Where(x => x.MissionId == missionId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-GetVehicleAssignmentByMissionId: {ex.Message}");
            return null;
        }
    }


    public async Task<VehicleAssignment?> AddVehicleAssignment(VehicleAssignment vehicleAssignment)
    {
        try
        {
            if (vehicleAssignment == null)
                throw new ArgumentNullException(nameof(vehicleAssignment));
            
            await _db.VehicleAssignments.AddAsync(vehicleAssignment);
            await _db.SaveChangesAsync();
            return vehicleAssignment;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-AddVehicleAssignment: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateVehicleAssignment(VehicleAssignment vehicleAssignment)
    {
        try
        {
            if (vehicleAssignment == null)
                throw new ArgumentNullException(nameof(vehicleAssignment));
            
            var existingAssignment = await _db.VehicleAssignments.FirstOrDefaultAsync(x => x.MissionId == vehicleAssignment.MissionId && x.VehicleId == vehicleAssignment.VehicleId);
            if (existingAssignment == null)
                throw new Exception("VehicleAssignment not found");
            existingAssignment.AssignedAt = vehicleAssignment.AssignedAt;
            existingAssignment.ReleasedAt = vehicleAssignment.ReleasedAt;
            _db.VehicleAssignments.Update(existingAssignment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-UpdateVehicleAssignment: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ReleasedVehicleAssignmentByVehicleId(int vehicleId)
    {
        try
        {
            
            var vehicleAssignment = await _db.VehicleAssignments.FirstOrDefaultAsync(x => x.VehicleId == vehicleId && x.ReleasedAt == null);
            if (vehicleAssignment == null)
                throw new Exception("VehicleAssignment not found");
            vehicleAssignment.ReleasedAt = DateTime.UtcNow;
            _db.VehicleAssignments.Update(vehicleAssignment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-ReleasedVehicleAssignmentById: {ex.Message}");
            return false;
        }
    }
    public async Task<bool> DeleteVehicleAssignmentById(int missionId, int vehicleId)
    {
        try
        {
            
            var vehicleAssignment = await _db.VehicleAssignments.FirstOrDefaultAsync(x => x.MissionId == missionId && x.VehicleId == vehicleId);
            if (vehicleAssignment == null)
                throw new Exception("VehicleAssignment not found");
            _db.VehicleAssignments.Remove(vehicleAssignment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-DeleteVehicleAssignmentById: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> IsVehicleRelease(int vehicleId)
    {
        try
        {
            
            return !await _db.VehicleAssignments.AnyAsync(x => x.VehicleId == vehicleId && x.ReleasedAt == null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehicleAssignmentDAO-IsVehicleRelease: {ex.Message}");
            return false;
        }
    }
}
