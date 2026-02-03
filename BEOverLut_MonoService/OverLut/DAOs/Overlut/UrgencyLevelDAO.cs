using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class UrgencyLevelDAO
{
    public static async Task<IEnumerable<UrgencyLevel>?> GetAllUrgencyLevel()
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.UrgencyLevels.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-GetAllUrgencyLevel: {ex.Message}");
            return null;
        }
    }

    public static async Task<UrgencyLevel?> GetUrgencyLevelById(int urgencyLevelId)
    {
        try
        {
            using var db = new OverlutDbContext();
            return await db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevelId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-GetUrgencyLevelById: {ex.Message}");
            return null;
        }
    }

    public static async Task<UrgencyLevel?> CreateUrgencyLevel(UrgencyLevel urgencyLevel)
    {
        try
        {
            if (urgencyLevel == null)
                throw new ArgumentNullException(nameof(urgencyLevel));
            using var db = new OverlutDbContext();
            await db.UrgencyLevels.AddAsync(urgencyLevel);
            await db.SaveChangesAsync();
            return urgencyLevel;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-CreateUrgencyLevel: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateUrgencyLevel(UrgencyLevel urgencyLevel)
    {
        try
        {
            if (urgencyLevel == null)
                throw new ArgumentNullException(nameof(urgencyLevel));
            using var db = new OverlutDbContext();
            var existingLevel = await db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevel.UrgencyLevelId);
            if (existingLevel == null)
                throw new Exception("UrgencyLevel not found");
            existingLevel.UrgencyName = urgencyLevel.UrgencyName;
            db.UrgencyLevels.Update(existingLevel);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-UpdateUrgencyLevel: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteUrgencyLevelById(int urgencyLevelId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var urgencyLevel = await db.UrgencyLevels.FirstOrDefaultAsync(x => x.UrgencyLevelId == urgencyLevelId);
            if (urgencyLevel == null)
                throw new Exception("UrgencyLevel not found");
            db.UrgencyLevels.Remove(urgencyLevel);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UrgencyLevelDAO-DeleteUrgencyLevelById: {ex.Message}");
            return false;
        }
    }
}
