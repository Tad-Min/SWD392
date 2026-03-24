using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut;

public interface IVolunteerProfileRepository
{
    Task<VolunteerProfile?> GetByUserId(int userId);
    Task<VolunteerProfile?> GetById(int profileId);
    Task<IEnumerable<VolunteerProfile>> GetByStatus(int? status);
    Task<VolunteerProfile?> Create(VolunteerProfile profile);
    Task<bool> Update(VolunteerProfile profile);
}
