using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.Overlut;

public class VolunteerProfileDAO
{
    private readonly OverlutDbContext _db;

    public VolunteerProfileDAO(OverlutDbContext db) => _db = db;

    public async Task<VolunteerProfile?> GetByUserId(int userId)
    {
        try
        {
            return await _db.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.VolunteerSkills)
                        .ThenInclude(s => s.SkillType)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerProfileDAO-GetByUserId: {ex.Message}");
            return null;
        }
    }

    public async Task<VolunteerProfile?> GetById(int profileId)
    {
        try
        {
            return await _db.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.VolunteerSkills)
                        .ThenInclude(s => s.SkillType)
                .FirstOrDefaultAsync(x => x.VolunteerProfileId == profileId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerProfileDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<VolunteerProfile>> GetByStatus(int? status)
    {
        try
        {
            var query = _db.VolunteerProfiles
                .Include(x => x.User)
                    .ThenInclude(u => u.VolunteerSkills)
                        .ThenInclude(s => s.SkillType)
                .AsQueryable();
            if (status.HasValue)
                query = query.Where(x => x.ApplicationStatus == status.Value);
            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerProfileDAO-GetByStatus: {ex.Message}");
            return new List<VolunteerProfile>();
        }
    }

    public async Task<VolunteerProfile?> Create(VolunteerProfile profile)
    {
        try
        {
            profile.CreatedAt = DateTime.UtcNow;
            profile.UpdatedAt = DateTime.UtcNow;
            await _db.VolunteerProfiles.AddAsync(profile);
            await _db.SaveChangesAsync();
            return await GetByUserId(profile.UserId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerProfileDAO-Create: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> Update(VolunteerProfile profile)
    {
        try
        {
            profile.UpdatedAt = DateTime.UtcNow;
            _db.VolunteerProfiles.Update(profile);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerProfileDAO-Update: {ex.Message}");
            return false;
        }
    }
}
