using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut;

public interface IVolunteerOfferAssignmentRepository
{
    Task<VolunteerOfferAssignment?> Create(VolunteerOfferAssignment assignment);
    Task<IEnumerable<VolunteerOfferAssignment>> GetByTeamId(int teamId);
    Task<bool> MarkReturned(int assignmentId, string? note);
}
