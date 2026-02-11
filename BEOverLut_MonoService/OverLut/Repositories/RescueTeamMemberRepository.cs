using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueTeamMemberRepository : IRescueTeamMemberRepository
    {
        public async Task<IEnumerable<RescueTeamMember>?> GetAllRescueTeamMembersWithTeamId(int teamId) => await RescueTeamMemberDAO.GetAllRescueTeamMembersWithTeamId(teamId);

        public async Task<RescueTeamMember?> AddRescueTeamMember(RescueTeamMember rescueTeamMember) => await RescueTeamMemberDAO.AddRescueTeamMember(rescueTeamMember);

        public async Task<bool> UpdateRescueTeamMember(RescueTeamMember rescueTeamMember) => await RescueTeamMemberDAO.UpdateRescueTeamMember(rescueTeamMember);

        public async Task<bool> DeleteRescueTeamMember(int userId, int teamId) => await RescueTeamMemberDAO.DeleteRescueTeamMember(userId, teamId);
    }
}
