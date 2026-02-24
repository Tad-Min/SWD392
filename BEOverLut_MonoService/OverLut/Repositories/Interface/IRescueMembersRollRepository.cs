using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMembersRollRepository
    {
        Task<IEnumerable<RescueMembersRole>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName);
        Task<RescueMembersRole?> CreateRescueMembersRoll(RescueMembersRole roll);
        Task<bool> UpdateRescueMembersRoll(RescueMembersRole roll);
    }
}
