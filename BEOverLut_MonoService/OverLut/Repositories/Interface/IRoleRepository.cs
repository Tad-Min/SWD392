using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>?> GetAllRoles();
        Task<Role?> GetRoleById(int roleId);
        Task<Role?> AddRole(Role role);
        Task<bool> UpdateRole(Role role);
        Task<bool> DeleteRole(int roleId);
    }
}
