using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RoleRepository : IRoleRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RoleDAO _roleDAO;

        public RoleRepository(OverlutDbContext db)
        {
            _db = db;
            _roleDAO = new RoleDAO(db);
        }
        public async Task<IEnumerable<Role>?> GetAllRoles() => await _roleDAO.GetAllRoles();

        public async Task<Role?> GetRoleById(int roleId) => await _roleDAO.GetRoleById(roleId);

        public async Task<Role?> AddRole(Role role) => await _roleDAO.AddRole(role);

        public async Task<bool> UpdateRole(Role role) => await _roleDAO.UpdateRole(role);

        public async Task<bool> DeleteRole(int roleId) => await _roleDAO.DeleteRole(roleId);
    }
}
