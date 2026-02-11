using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMembersRollRepository
    {
        Task<IEnumerable<RescueMembersRoll>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName);
        Task<RescueMembersRoll?> CreateRescueMembersRoll(RescueMembersRoll roll);
        Task<bool> UpdateRescueMembersRoll(RescueMembersRoll roll);
    }
}
