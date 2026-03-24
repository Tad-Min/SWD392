using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut;

public class VolunteerProfileRepository : IVolunteerProfileRepository
{
    private readonly OverlutDbContext _db;
    private readonly VolunteerProfileDAO _dao;

    public VolunteerProfileRepository(OverlutDbContext db)
    {
        _db = db;
        _dao = new VolunteerProfileDAO(db);
    }

    public async Task<VolunteerProfile?> GetByUserId(int userId) => await _dao.GetByUserId(userId);
    public async Task<VolunteerProfile?> GetById(int profileId) => await _dao.GetById(profileId);
    public async Task<IEnumerable<VolunteerProfile>> GetByStatus(int? status) => await _dao.GetByStatus(status);
    public async Task<VolunteerProfile?> Create(VolunteerProfile profile) => await _dao.Create(profile);
    public async Task<bool> Update(VolunteerProfile profile) => await _dao.Update(profile);
}
