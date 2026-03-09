using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMembersRoleRepository : IRescueMembersRoleRepository
    {
        public async Task<IEnumerable<RescueMembersRole>?> GetAllRescueMembersRoles() => await RescueMembersRoleDAO.GetAllRescueMembersRoles();

        public async Task<RescueMembersRole?> GetRescueMembersRoleById(int id) => await RescueMembersRoleDAO.GetRescueMembersRoleById(id);

        public async Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll) => await RescueMembersRoleDAO.CreateRescueMembersRole(roll);

        public async Task<bool> UpdateRescueMembersRole(RescueMembersRole roll) => await RescueMembersRoleDAO.UpdateRescueMembersRole(roll);
        public async Task<bool> DeleteRescueMembersRoleById(int id) => await RescueMembersRoleDAO.DeleteRescueMembersRoleById(id);

    }
}
