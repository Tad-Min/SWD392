using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMembersRollRepository : IRescueMembersRollRepository
    {
        public async Task<IEnumerable<RescueMembersRole>?> GetRescueMembersRolls(int? rescueMembersRollId, string? rollName) => await RescueMembersRoleDAO.GetRescueMembersRoles(rescueMembersRollId, rollName);

        public async Task<RescueMembersRole?> CreateRescueMembersRoll(RescueMembersRole roll) => await RescueMembersRoleDAO.CreateRescueMembersRole(roll);

        public async Task<bool> UpdateRescueMembersRoll(RescueMembersRole roll) => await RescueMembersRoleDAO.UpdateRescueMembersRole(roll);
    }
}
