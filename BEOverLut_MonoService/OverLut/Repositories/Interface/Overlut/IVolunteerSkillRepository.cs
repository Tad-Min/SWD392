using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut;

public interface IVolunteerSkillRepository
{
    Task<IEnumerable<VolunteerSkill>> GetByUserId(int userId);
    Task<bool> SetSkills(int userId, IEnumerable<int> skillTypeIds);
    Task<IEnumerable<VolunteerSkillType>> GetAllSkillTypes();
}
