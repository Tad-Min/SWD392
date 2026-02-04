using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRoleRepository
    {
        Task<IEnumerable<Role>?> GetAllRoles();
        Task<Role?> GetRoleById(int roleId);
        Task<Role?> AddRole(Role role);
        Task<bool> UpdateRole(Role role);
        Task<bool> DeleteRole(int roleId);
    }
}
