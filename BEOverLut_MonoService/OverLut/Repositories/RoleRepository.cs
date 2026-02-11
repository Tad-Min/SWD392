using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RoleRepository : IRoleRepository
    {
        public async Task<IEnumerable<Role>?> GetAllRoles() => await RoleDAO.GetAllRoles();

        public async Task<Role?> GetRoleById(int roleId) => await RoleDAO.GetRoleById(roleId);

        public async Task<Role?> AddRole(Role role) => await RoleDAO.AddRole(role);

        public async Task<bool> UpdateRole(Role role) => await RoleDAO.UpdateRole(role);

        public async Task<bool> DeleteRole(int roleId) => await RoleDAO.DeleteRole(roleId);
    }
}
