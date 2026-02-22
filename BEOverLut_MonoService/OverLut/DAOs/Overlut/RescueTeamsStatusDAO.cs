using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamsStatusDAO
{
    public static async Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueTeamsStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-GetAllRescueTeamsStatus: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.RescueTeamsStatuses.FirstOrDefaultAsync(x => x.RescueTeamsStatusId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-GetRescueTeamsStatusById: {ex.Message}");
            return null;
        }
    }

    public static async Task<RescueTeamsStatus?> CreateRescueTeamsStatus(RescueTeamsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            await db.RescueTeamsStatuses.AddAsync(status);
            await db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-CreateRescueTeamsStatus: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            using var db = new OverlutDbContext();
            var existingStatus = await db.RescueTeamsStatuses.FirstOrDefaultAsync(
                x => x.RescueTeamsStatusId == status.RescueTeamsStatusId);

            if (existingStatus == null) return false;

            existingStatus.IsDeleted = true;
            db.RescueTeamsStatuses.Update(existingStatus);

            var newStatus = new RescueTeamsStatus
            {
                StatusName = status.StatusName,
                IsDeleted = false
            };
            await db.RescueTeamsStatuses.AddAsync(newStatus);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-UpdateRescueTeamsStatus: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueTeamsStatusById(int id)
    {
        try
        {
            using var db = new OverlutDbContext();
            var status = await db.RescueTeamsStatuses.FirstOrDefaultAsync(x => x.RescueTeamsStatusId == id);

            if (status == null) return false;

            status.IsDeleted = true;
            db.RescueTeamsStatuses.Update(status);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-DeleteRescueTeamsStatusById: {ex.Message}");
            return false;
        }
    }
}
