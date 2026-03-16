using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestsStatusDAO
{
    private readonly OverlutDbContext _db;

    public RescueRequestsStatusDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName)
    {
        try
        {
            
            var query = _db.RescueRequestsStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-GetAllRescueRequestsStatus: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id)
    {
        try
        {
            
            return await _db.RescueRequestsStatuses.FirstOrDefaultAsync(x => x.RescueRequestsStatusId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-GetRescueRequestsStatusById: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueRequestsStatus?> CreateRescueRequestsStatus(RescueRequestsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            await _db.RescueRequestsStatuses.AddAsync(status);
            await _db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-CreateRescueRequestsStatus: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            var existingStatus = await _db.RescueRequestsStatuses.FirstOrDefaultAsync(
                x => x.RescueRequestsStatusId == status.RescueRequestsStatusId);

            if (existingStatus == null) return false;

            existingStatus.StatusName = status.StatusName;
            _db.RescueRequestsStatuses.Update(existingStatus);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-UpdateRescueRequestsStatus: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueRequestsStatusById(int id)
    {
        try
        {
            
            var status = await _db.RescueRequestsStatuses.FirstOrDefaultAsync(x => x.RescueRequestsStatusId == id);

            if (status == null) return false;

            _db.RescueRequestsStatuses.Remove(status);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestsStatusDAO-DeleteRescueRequestsStatusById: {ex.Message}");
            return false;
        }
    }
}
