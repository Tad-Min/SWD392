using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.Overlut;

public class VolunteerSkillDAO
{
    private readonly OverlutDbContext _db;

    public VolunteerSkillDAO(OverlutDbContext db) => _db = db;

    public async Task<IEnumerable<VolunteerSkill>> GetByUserId(int userId)
    {
        try
        {
            return await _db.VolunteerSkills
                .Include(x => x.SkillType)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerSkillDAO-GetByUserId: {ex.Message}");
            return new List<VolunteerSkill>();
        }
    }

    /// <summary>Replace all skills for a user atomically.</summary>
    public async Task<bool> SetSkills(int userId, IEnumerable<int> skillTypeIds)
    {
        try
        {
            var existing = _db.VolunteerSkills.Where(x => x.UserId == userId);
            _db.VolunteerSkills.RemoveRange(existing);

            foreach (var id in skillTypeIds.Distinct())
            {
                await _db.VolunteerSkills.AddAsync(new VolunteerSkill { UserId = userId, SkillTypeId = id });
            }
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerSkillDAO-SetSkills: {ex.Message}");
            return false;
        }
    }

    public async Task<IEnumerable<VolunteerSkillType>> GetAllSkillTypes()
    {
        try
        {
            return await _db.VolunteerSkillTypes.OrderBy(x => x.SkillName).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerSkillDAO-GetAllSkillTypes: {ex.Message}");
            return new List<VolunteerSkillType>();
        }
    }
}
