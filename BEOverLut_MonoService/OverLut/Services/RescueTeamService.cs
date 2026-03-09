using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
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
        public async Task<RescueTeam?> GetRescueTeamByTeamId(int teamId)
        {
            return await _rescueTeamRepository.GetRescueTeamByTeamId(teamId);
        }

        public async Task<RescueTeam?> CreateRescueTeamAsync(RescueTeam rescueTeam)
        {
            return await _rescueTeamRepository.CreateRescueTeam(rescueTeam);
        }

        public async Task<RescueTeam?> DeleteTeamByIdAsync(int id)
        {
            var teams = await _rescueTeamRepository.GetAllRescueTeam(id);
            var team = teams?.FirstOrDefault();
            if (team == null) return null;

            var result = await _rescueTeamRepository.DeleteRescueTeamById(id);
            return result ? team : null;
        }

        public async Task<IEnumerable<RescueTeamDTO>?> GetRescueTeamByUserId(int userId)
        {
            var teamMembers = await _rescueTeamRepository.GetRescueTeamByUserId(userId);
            if (teamMembers == null) return null;
            var rescueTeamDTOs = new List<RescueTeamDTO>();
            foreach (var member in teamMembers)
            {
                var teams = await _rescueTeamRepository.GetAllRescueTeam(member.TeamId);
                var team = teams?.FirstOrDefault();
                if (team != null)
                {
                    rescueTeamDTOs.Add(new RescueTeamDTO
                    {
                        TeamId = team.TeamId,
                        TeamName = team.TeamName,
                        StatusId = team.StatusId,
                        CreatedAt = team.CreatedAt,
                    });
                }
            }
            return rescueTeamDTOs;
        }

        public async Task<RescueTeamMemberDTO?> GetRescueTeamMemberByUserIdAndTeamId(int userId, int teamId)
        {
            var members = await _rescueTeamMemberRepository.GetRescueTeamMemberByUserIdAndTeamId(userId, teamId);
            if (members == null) return null;

            return MappingHandle.EntityToDTO(members);
        }

        public async Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam)
        {
            return await _rescueTeamRepository.UpdateRescueTeam(rescueTeam);
        }
        #endregion

        #region RescueTeamMember
        public async Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberByTeamIdAsync(int? teamId)
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

        public async Task<RescueTeamMemberDTO?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember)
        {
            var member = await _rescueTeamMemberRepository.AddRescueTeamMember(rescueTeamMember);
            if (member == null) return null;
            return MappingHandle.EntityToDTO(member);
        }
        #endregion

        #region Rescue Members Roll
        public async Task<IEnumerable<RescueMembersRoleDTO>?> GetAllRescueMemberRolesAsync(int? id, string? name)
        {
            var roles = await _rescueMembersRollRepository.GetRescueMembersRoles(id, name);
            if (roles == null) return new List<RescueMembersRoleDTO>();
            
            return roles.Select(x => MappingHandle.EntityToDTO(x))
                .Where(r => r != null)
                .Cast<RescueMembersRoleDTO>();
        }

        public async Task<RescueMembersRole?> GetRescueMembersRoleByIdAsync(int id)
        {
            var rolls = await _rescueMembersRollRepository.GetRescueMembersRoles(id, null);
            return rolls?.FirstOrDefault();
        }

        public async Task<RescueMembersRole?> AddRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll)
        {
            return await _rescueMembersRollRepository.CreateRescueMembersRole(rescueMembersRoll);
        }

        public async Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll)
        {
            return await _rescueMembersRollRepository.UpdateRescueMembersRole(rescueMembersRoll);
        }

        public async Task<bool> DeleteRescueMemberRoleByIdAsync(int id)
        {
            return await _rescueMembersRollRepository.DeleteRescueMembersRoleById(id);
        }
        #endregion
    }
}
