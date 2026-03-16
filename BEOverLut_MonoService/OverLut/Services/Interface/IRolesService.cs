using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IRolesService
    {
        #region UserRoles
        Task<IEnumerable<RoleDTO>?> GetUserRolesAsync();
        Task<RoleDTO?> GetUserRoleByIdAsync(int id);
        Task<RoleDTO?> CreateUserRoleAsync(int id, string name);
        Task<bool> UpdateUserRoleAsync(Role role);
        Task<bool> DeleteUserRoleByIdAsync(int id);
        #endregion
        #region RescueMembersRoles
        Task<IEnumerable<RescueMembersRoleDTO>?> GetAllRescueMembersRolesAsync();
        Task<RescueMembersRoleDTO?> GetRescueMembersRoleByIdAsync(int id);
        Task<RescueMembersRoleDTO?> CreateRescueMembersRoleAsync(int id, string name);
        Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole role);
        Task<bool> DeleteRescueMembersRoleByIdAsync(int id);
        #endregion
    }
}
