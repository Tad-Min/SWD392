using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMembersRoleRepository
    {
        Task<IEnumerable<RescueMembersRole>?> GetAllRescueMembersRoles();
        Task<RescueMembersRole?> GetRescueMembersRoleById(int id);
        Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll);
        Task<bool> UpdateRescueMembersRole(RescueMembersRole roll);
        Task<bool> DeleteRescueMembersRoleById(int id);
    }
}
