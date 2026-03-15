using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class VehiclesStatusDAO
{
    private readonly OverlutDbContext _db;

    public VehiclesStatusDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName)
    {
        try
        {
            
            var query = _db.VehiclesStatuses.AsQueryable();

            if (!string.IsNullOrEmpty(statusName))
                query = query.Where(x => x.StatusName.Contains(statusName) && !x.IsDeleted);

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-GetAll: {ex.Message}");
            return null;
        }
    }

    public async Task<VehiclesStatus?> GetById(int id)
    {
        try
        {
            
            return await _db.VehiclesStatuses.FirstOrDefaultAsync(x => x.VehiclesStatusId == id && !x.IsDeleted);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public async Task<VehiclesStatus?> Create(VehiclesStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            await _db.VehiclesStatuses.AddAsync(status);
            await _db.SaveChangesAsync();
            return status;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Create: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> Update(VehiclesStatus status)
    {
        try
        {
            if (status == null)
                throw new ArgumentNullException(nameof(status));

            if (string.IsNullOrWhiteSpace(status.StatusName))
                throw new ArgumentException("StatusName cannot be null or empty", nameof(status));

            
            var existingStatus = await _db.VehiclesStatuses.FirstOrDefaultAsync(
                x => x.VehiclesStatusId == status.VehiclesStatusId);

            if (existingStatus == null) return false;

            existingStatus.StatusName = status.StatusName;
            _db.VehiclesStatuses.Update(existingStatus);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Update: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> Delete(int id)
    {
        try
        {
            
            var status = await _db.VehiclesStatuses.FirstOrDefaultAsync(x => x.VehiclesStatusId == id);

            if (status == null) return false;

            _db.VehiclesStatuses.Remove(status);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VehiclesStatusDAO-Delete: {ex.Message}");
            return false;
        }
    }
}
