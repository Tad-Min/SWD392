using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Appsettings;
using DTOs.Overlut;
using Microsoft.Extensions.Options;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class RescueTeamService : IRescueTeamService
    {
        private readonly IRescueTeamRepository _rescueTeamRepository;
        private readonly IRescueTeamMemberRepository _rescueTeamMemberRepository;
        private readonly IRescueTeamsStatusRepository _rescueTeamsStatusRepository;
        private readonly IRescueMembersRoleRepository _rescueMembersRoleRepository;
        private readonly RescueTeamSettings rescueTeamSettings;

        public RescueTeamService(
            IRescueTeamRepository rescueTeamRepository,
            IRescueTeamMemberRepository rescueTeamMemberRepository,
            IRescueTeamsStatusRepository rescueTeamsStatusRepository,
            IRescueMembersRoleRepository rescueMembersRoleRepository,
            IOptions<RescueTeamSettings> rescueTeamSettings)
        {
            _rescueTeamRepository = rescueTeamRepository;
            _rescueTeamMemberRepository = rescueTeamMemberRepository;
            _rescueTeamsStatusRepository = rescueTeamsStatusRepository;
            _rescueMembersRoleRepository = rescueMembersRoleRepository;
            this.rescueTeamSettings = rescueTeamSettings.Value;
        }

        #region RescueTeam
        public async Task<IEnumerable<RescueTeamDTO>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId)
        {
            var teams = await _rescueTeamRepository.GetAllRescueTeam(teamId, teamName, statusId);
            if (teams == null) return new List<RescueTeamDTO>();

            return teams.Select(e => MappingHandle.EntityToDTO(e)).Where(dto => dto != null).Cast<RescueTeamDTO>();
        }
        public async Task<RescueTeam?> GetRescueTeamByTeamId(int teamId)
        {
            return await _rescueTeamRepository.GetRescueTeamByTeamId(teamId);
        }

        public async Task<RescueTeam?> CreateRescueTeamAsync(RescueTeam rescueTeam)
        {
            rescueTeam.StatusId = rescueTeamSettings.DefaultStatusId;
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

        public async Task<bool> DeleteRescueTeamMember(int userId, int teamId)
        {
            return await _rescueTeamMemberRepository.DeleteRescueTeamMember(userId, teamId);
        }

        public async Task<RescueTeamMemberDTO?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember)
        {
            var member = await _rescueTeamMemberRepository.AddRescueTeamMember(rescueTeamMember);
            if (member == null) return null;
            return MappingHandle.EntityToDTO(member);
        }
        #endregion
    }
}
