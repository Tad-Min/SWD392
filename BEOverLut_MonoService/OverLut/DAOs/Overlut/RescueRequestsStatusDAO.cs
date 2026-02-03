using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestsStatusDAO
{
    public static async Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueRequestsStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-GetAllRescueRequestsStatus: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueRequestsStatuses.FirstOrDefaultAsync(x => x.RescueRequestsStatusId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-GetRescueRequestsStatusById: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueRequestsStatus?> CreateRescueRequestsStatus(RescueRequestsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            await db.RescueRequestsStatuses.AddAsync(status);
            await db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-CreateRescueRequestsStatus: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            var existingStatus = await db.RescueRequestsStatuses.FirstOrDefaultAsync(
                x => x.RescueRequestsStatusId == status.RescueRequestsStatusId);

            if (existingStatus == null) return false;

            existingStatus.StatusName = status.StatusName;
            db.RescueRequestsStatuses.Update(existingStatus);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-UpdateRescueRequestsStatus: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueRequestsStatusById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var status = await db.RescueRequestsStatuses.FirstOrDefaultAsync(x => x.RescueRequestsStatusId == id);

            if (status == null) return false;

            db.RescueRequestsStatuses.Remove(status);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-DeleteRescueRequestsStatusById: {ex.Message}");
            return false;
        }
    }
}
