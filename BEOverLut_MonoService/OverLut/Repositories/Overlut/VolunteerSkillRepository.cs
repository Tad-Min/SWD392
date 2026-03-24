using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut;

public class VolunteerSkillRepository : IVolunteerSkillRepository
{
    private readonly VolunteerSkillDAO _dao;

    public VolunteerSkillRepository(OverlutDbContext db)
    {
        _dao = new VolunteerSkillDAO(db);
    }

    public async Task<IEnumerable<VolunteerSkill>> GetByUserId(int userId) => await _dao.GetByUserId(userId);
    public async Task<bool> SetSkills(int userId, IEnumerable<int> skillTypeIds) => await _dao.SetSkills(userId, skillTypeIds);
    public async Task<IEnumerable<VolunteerSkillType>> GetAllSkillTypes() => await _dao.GetAllSkillTypes();
}
