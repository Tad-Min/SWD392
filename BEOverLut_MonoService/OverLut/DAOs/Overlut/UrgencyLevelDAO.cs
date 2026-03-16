using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class UrgencyLevelDAO
{
    private readonly OverlutDbContext _db;

    public UrgencyLevelDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel()
    {
        try
        {
            
            return await _db.UrgencyLevels.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-GetAllUrgencyLevel: {ex.Message}");
            return null;
        }
    }

    public async Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId)
    {
        try
        {
            
            return await _db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevelId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-GetUrgencyLevelById: {ex.Message}");
            return null;
        }
    }

    public async Task<UrgencyLevel?> CreateUrgencyLevel(UrgencyLevel urgencyLevel)
    {
        try
        {
            if (urgencyLevel == null)
                throw new ArgumentNullException(nameof(urgencyLevel));
            
            await _db.UrgencyLevels.AddAsync(urgencyLevel);
            await _db.SaveChangesAsync();
            return urgencyLevel;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-CreateUrgencyLevel: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateUrgencyLevel(UrgencyLevel urgencyLevel)
    {
        try
        {
            if (urgencyLevel == null)
                throw new ArgumentNullException(nameof(urgencyLevel));
            
            var existingLevel = await _db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevel.UrgencyLevelId);
            if (existingLevel == null)
                throw new Exception("UrgencyLevel not found");
            
            existingLevel.IsDeleted = true;
            _db.UrgencyLevels.Update(existingLevel);

            var newLevel = new UrgencyLevel
            {
                UrgencyName = urgencyLevel.UrgencyName,
                IsDeleted = false
            };
            await _db.UrgencyLevels.AddAsync(newLevel);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-UpdateUrgencyLevel: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteUrgencyLevelById(int urgencyLevelId)
    {
        try
        {
            
            var urgencyLevel = await _db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevelId);
            if (urgencyLevel == null)
                throw new Exception("UrgencyLevel not found");
            
            urgencyLevel.IsDeleted = true;
            _db.UrgencyLevels.Update(urgencyLevel);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-DeleteUrgencyLevelById: {ex.Message}");
            return false;
        }
    }
}
