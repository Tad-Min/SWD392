using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut;

public class VolunteerOfferAssignmentRepository : IVolunteerOfferAssignmentRepository
{
    private readonly VolunteerOfferAssignmentDAO _dao;

    public VolunteerOfferAssignmentRepository(OverlutDbContext db)
    {
        _dao = new VolunteerOfferAssignmentDAO(db);
    }

    public async Task<VolunteerOfferAssignment?> Create(VolunteerOfferAssignment assignment) => await _dao.Create(assignment);
    public async Task<IEnumerable<VolunteerOfferAssignment>> GetByTeamId(int teamId) => await _dao.GetByTeamId(teamId);
    public async Task<bool> MarkReturned(int assignmentId, string? note) => await _dao.MarkReturned(assignmentId, note);
}
