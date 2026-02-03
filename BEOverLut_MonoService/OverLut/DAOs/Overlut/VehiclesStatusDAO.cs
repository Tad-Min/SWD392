using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehiclesStatusDAO
{
    public static async Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.VehiclesStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-GetAll: {ex.Message}");
            return null;
        }
    }

    public static async Task<VehiclesStatus?> GetById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.VehiclesStatuses.FirstOrDefaultAsync(x => x.VehiclesStatusId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public static async Task<VehiclesStatus?> Create(VehiclesStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            await db.VehiclesStatuses.AddAsync(status);
            await db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Create: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> Update(VehiclesStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            var existingStatus = await db.VehiclesStatuses.FirstOrDefaultAsync(
                x => x.VehiclesStatusId == status.VehiclesStatusId);

            if (existingStatus == null) return false;

            existingStatus.StatusName = status.StatusName;
            db.VehiclesStatuses.Update(existingStatus);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Update: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> Delete(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var status = await db.VehiclesStatuses.FirstOrDefaultAsync(x => x.VehiclesStatusId == id);

            if (status == null) return false;

            db.VehiclesStatuses.Remove(status);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Delete: {ex.Message}");
            return false;
        }
    }
}
