using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueMissionsStatusDAO
{
    private readonly OverlutDbContext _db;

    public RescueMissionsStatusDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName)
    {
        try
        {
            
            var query = _db.RescueMissionsStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-GetAll: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id)
    {
        try
        {
            
            return await _db.RescueMissionsStatuses.FirstOrDefaultAsync(x => x.RescueMissionsStatusId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueMissionsStatus?> CreateRescueMissionsStatus(RescueMissionsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            await _db.RescueMissionsStatuses.AddAsync(status);
            await _db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-CreateRescueMissionsStatus: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            var existingStatus = await _db.RescueMissionsStatuses.FirstOrDefaultAsync(
                x => x.RescueMissionsStatusId == status.RescueMissionsStatusId);

            if (existingStatus == null) return false;

            existingStatus.IsDeleted = true;
            _db.RescueMissionsStatuses.Update(existingStatus);

            var newStatus = new RescueMissionsStatus
            {
                StatusName = status.StatusName,
                IsDeleted = false
            };
            await _db.RescueMissionsStatuses.AddAsync(newStatus);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-UpdateRescueMissionsStatus: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueMissionsStatus(int id)
    {
        try
        {
            
            var status = await _db.RescueMissionsStatuses.FirstOrDefaultAsync(x => x.RescueMissionsStatusId == id);

            if (status == null) return false;

            status.IsDeleted = true;
            _db.RescueMissionsStatuses.Update(status);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueMissionsStatusDAO-DeleteRescueMissionsStatus: {ex.Message}");
            return false;
        }
    }
}
