using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMembersRollRepository : IRescueMembersRollRepository
    {
        public async Task<IEnumerable<RescueMembersRole>?> GetRescueMembersRoles(int? rescueMembersRollId, string? rollName) => await RescueMembersRoleDAO.GetRescueMembersRoles(rescueMembersRollId, rollName);

        public async Task<RescueMembersRole?> CreateRescueMembersRole(RescueMembersRole roll) => await RescueMembersRoleDAO.CreateRescueMembersRole(roll);

        public async Task<bool> UpdateRescueMembersRole(RescueMembersRole roll) => await RescueMembersRoleDAO.UpdateRescueMembersRole(roll);
        public async Task<bool> DeleteRescueMembersRoleById(int id) => await RescueMembersRoleDAO.DeleteRescueMembersRoleById(id);

    }
}
