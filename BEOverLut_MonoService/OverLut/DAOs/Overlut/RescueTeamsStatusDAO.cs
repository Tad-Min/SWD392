using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueTeamsStatusDAO
{
    private readonly OverlutDbContext _db;

    public RescueTeamsStatusDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName)
    {
        try
        {
            
            var query = _db.RescueTeamsStatuses.AsQueryable();

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

    public async Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id)
    {
        try
        {
            
            return await _db.RescueTeamsStatuses.FirstOrDefaultAsync(x => x.RescueTeamsStatusId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-GetRescueTeamsStatusById: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueTeamsStatus?> CreateRescueTeamsStatus(RescueTeamsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            await _db.RescueTeamsStatuses.AddAsync(status);
            await _db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-CreateRescueTeamsStatus: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            var existingStatus = await _db.RescueTeamsStatuses.FirstOrDefaultAsync(
                x => x.RescueTeamsStatusId == status.RescueTeamsStatusId);

            if (existingStatus == null) return false;

            existingStatus.IsDeleted = true;
            _db.RescueTeamsStatuses.Update(existingStatus);

            var newStatus = new RescueTeamsStatus
            {
                StatusName = status.StatusName,
                IsDeleted = false
            };
            await _db.RescueTeamsStatuses.AddAsync(newStatus);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-UpdateRescueTeamsStatus: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueTeamsStatusById(int id)
    {
        try
        {
            
            var status = await _db.RescueTeamsStatuses.FirstOrDefaultAsync(x => x.RescueTeamsStatusId == id);

            if (status == null) return false;

            status.IsDeleted = true;
            _db.RescueTeamsStatuses.Update(status);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueTeamsStatusDAO-DeleteRescueTeamsStatusById: {ex.Message}");
            return false;
        }
    }
}
