using BusinessObject.OverlutEntiy;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class RescueTeamService : IRescueTeamService
    {
        private readonly IRescueTeamRepository _rescueTeamRepository;
        private readonly IRescueTeamMemberRepository _rescueTeamMemberRepository;
        private readonly IRescueTeamsStatusRepository _rescueTeamsStatusRepository;
        private readonly IRescueMembersRollRepository _rescueMembersRollRepository;

        public RescueTeamService(
            IRescueTeamRepository rescueTeamRepository,
            IRescueTeamMemberRepository rescueTeamMemberRepository,
            IRescueTeamsStatusRepository rescueTeamsStatusRepository,
            IRescueMembersRollRepository rescueMembersRollRepository)
        {
            _rescueTeamRepository = rescueTeamRepository;
            _rescueTeamMemberRepository = rescueTeamMemberRepository;
            _rescueTeamsStatusRepository = rescueTeamsStatusRepository;
            _rescueMembersRollRepository = rescueMembersRollRepository;
        }

        #region RescueTeam
        public async Task<IEnumerable<RescueTeam>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId)
        {
            return await _rescueTeamRepository.GetAllRescueTeam(teamId, teamName, statusId);
        }

        public async Task<RescueTeam?> DeleteTeamByIdAsync(int id)
        {
            var teams = await _rescueTeamRepository.GetAllRescueTeam(id);
            var team = teams?.FirstOrDefault();
            if (team == null) return null;

            var result = await _rescueTeamRepository.DeleteRescueTeamById(id);
            return result ? team : null;
        }

        public async Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam)
        {
            return await _rescueTeamRepository.UpdateRescueTeam(rescueTeam);
        }
        #endregion

        #region RescueTeamMember
        public async Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberAsync(int? teamId, string? teamName, int? statusId)
        {
            if (teamId.HasValue)
                return await _rescueTeamMemberRepository.GetAllRescueTeamMembersWithTeamId(teamId.Value);
            return null;
        }

        public async Task<RescueTeam?> KickTeamMemberByMemberIdAsync(int id)
        {
            // Find team members for the given user, then delete
            // This returns the team after kicking the member
            return null;
        }

        public async Task<RescueTeam?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember)
        {
            var member = await _rescueTeamMemberRepository.AddRescueTeamMember(rescueTeamMember);
            if (member == null) return null;
            var teams = await _rescueTeamRepository.GetAllRescueTeam(member.TeamId);
            return teams?.FirstOrDefault();
        }
        #endregion

        #region Rescue Members Roll
        public async Task<IEnumerable<RescueMembersRole>?> GetAllRescueMemberRollsAsync()
        {
            return await _rescueMembersRollRepository.GetRescueMembersRolls(null, null);
        }

        public async Task<RescueMembersRole?> GetRescueMembersRoleByIdAsync(int id)
        {
            var rolls = await _rescueMembersRollRepository.GetRescueMembersRolls(id, null);
            return rolls?.FirstOrDefault();
        }

        public async Task<RescueMembersRole?> AddRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll)
        {
            return await _rescueMembersRollRepository.CreateRescueMembersRoll(rescueMembersRoll);
        }

        public async Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll)
        {
            return await _rescueMembersRollRepository.UpdateRescueMembersRoll(rescueMembersRoll);
        }

        public async Task<bool> DeleteRescueMemberRollByIdAsync(int id)
        {
            // RescueMembersRoleRepository doesn't have a delete method
            // This would need to be added to the repository if needed
            return false;
        }
        #endregion
    }
}
