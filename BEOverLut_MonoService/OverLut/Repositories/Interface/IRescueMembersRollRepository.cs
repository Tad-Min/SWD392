using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMembersRollRepository
    {
        Task<IEnumerable<RescueMembersRole>?> GetRescueMembersRoles(int? rescueMembersRollId, string? rollName);
        Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll);
        Task<bool> UpdateRescueMembersRole(RescueMembersRole roll);
        Task<bool> DeleteRescueMembersRoleById(int id);
    }
}
