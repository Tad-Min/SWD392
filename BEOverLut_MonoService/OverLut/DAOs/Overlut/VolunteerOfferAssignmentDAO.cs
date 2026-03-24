using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.Overlut;

public class VolunteerOfferAssignmentDAO
{
    private readonly OverlutDbContext _db;

    public VolunteerOfferAssignmentDAO(OverlutDbContext db) => _db = db;

    public async Task<VolunteerOfferAssignment?> Create(VolunteerOfferAssignment assignment)
    {
        try
        {
            assignment.AssignedAt = DateTime.UtcNow;
            await _db.VolunteerOfferAssignments.AddAsync(assignment);
            await _db.SaveChangesAsync();
            return assignment;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferAssignmentDAO-Create: {ex.Message}");
            return null;
        }
    }

    public async Task<IEnumerable<VolunteerOfferAssignment>> GetByTeamId(int teamId)
    {
        try
        {
            return await _db.VolunteerOfferAssignments
                .Include(x => x.Offer)
                .Include(x => x.Team)
                .Where(x => x.TeamId == teamId)
                .OrderByDescending(x => x.AssignedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferAssignmentDAO-GetByTeamId: {ex.Message}");
            return new List<VolunteerOfferAssignment>();
        }
    }

    public async Task<bool> MarkReturned(int assignmentId, string? note)
    {
        try
        {
            var assignment = await _db.VolunteerOfferAssignments.FindAsync(assignmentId);
            if (assignment == null) return false;
            assignment.ReturnedAt = DateTime.UtcNow;
            assignment.ReturnConditionNote = note;
            _db.VolunteerOfferAssignments.Update(assignment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferAssignmentDAO-MarkReturned: {ex.Message}");
            return false;
        }
    }
}
