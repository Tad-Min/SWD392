using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMissionsStatusDAO
{
    public static async Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueMissionsStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName));

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-GetAll: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueMissionsStatuses.FirstOrDefaultAsync(x => x.RescueMissionsStatusId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueMissionsStatus?> CreateRescueMissionsStatus(RescueMissionsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            await db.RescueMissionsStatuses.AddAsync(status);
            await db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-CreateRescueMissionsStatus: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            var existingStatus = await db.RescueMissionsStatuses.FirstOrDefaultAsync(
                x => x.RescueMissionsStatusId == status.RescueMissionsStatusId);

            if (existingStatus == null) return false;

            existingStatus.StatusName = status.StatusName;
            db.RescueMissionsStatuses.Update(existingStatus);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-UpdateRescueMissionsStatus: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueMissionsStatus(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var status = await db.RescueMissionsStatuses.FirstOrDefaultAsync(x => x.RescueMissionsStatusId == id);

            if (status == null) return false;

            db.RescueMissionsStatuses.Remove(status);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-DeleteRescueMissionsStatus: {ex.Message}");
            return false;
        }
    }
}
