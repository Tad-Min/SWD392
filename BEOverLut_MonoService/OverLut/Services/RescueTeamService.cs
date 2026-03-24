using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Appsettings;
using DTOs.Overlut;
using Microsoft.Extensions.Options;
using Repositories.Interface.Overlut;
using Services.Interface;

namespace Services
{
    public class RescueTeamService : IRescueTeamService
    {
        private readonly IRescueTeamRepository _rescueTeamRepository;
        private readonly IRescueTeamMemberRepository _rescueTeamMemberRepository;
        private readonly IRescueTeamsStatusRepository _rescueTeamsStatusRepository;
        private readonly IRescueMembersRoleRepository _rescueMembersRoleRepository;
        private readonly IVolunteerProfileRepository _volunteerProfileRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly RescueTeamSettings rescueTeamSettings;

        public RescueTeamService(
            IRescueTeamRepository rescueTeamRepository,
            IRescueTeamMemberRepository rescueTeamMemberRepository,
            IRescueTeamsStatusRepository rescueTeamsStatusRepository,
            IRescueMembersRoleRepository rescueMembersRoleRepository,
            IVolunteerProfileRepository volunteerProfileRepository,
            IUserRepository userRepository,
            IEmailService emailService,
            IOptions<RescueTeamSettings> rescueTeamSettings)
        {
            _rescueTeamRepository = rescueTeamRepository;
            _rescueTeamMemberRepository = rescueTeamMemberRepository;
            _rescueTeamsStatusRepository = rescueTeamsStatusRepository;
            _rescueMembersRoleRepository = rescueMembersRoleRepository;
            _volunteerProfileRepository = volunteerProfileRepository;
            _userRepository = userRepository;
            _emailService = emailService;
            this.rescueTeamSettings = rescueTeamSettings.Value;
        }

        #region RescueTeam
        public async Task<IEnumerable<RescueTeamDTO>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId)
        {
            var teams = await _rescueTeamRepository.GetAllRescueTeam(teamId, teamName, statusId);
            if (teams == null) return new List<RescueTeamDTO>();

            return teams.Select(e => MappingHandle.EntityToDTO(e)).Where(dto => dto != null).Cast<RescueTeamDTO>();
        }

        public async Task<IEnumerable<RescueMembersRoleDTO>?> GetAllRescueTeamRolesAsync()
        {
            var roles = await _rescueMembersRoleRepository.GetAllRescueMembersRoles();
            if (roles == null) return new List<RescueMembersRoleDTO>();

            return roles.Select(e => MappingHandle.EntityToDTO(e)).Where(dto => dto != null).Cast<RescueMembersRoleDTO>();
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
            if (teamMembers == null) return new List<RescueTeamDTO>();
            
            return teamMembers.Select(e => MappingHandle.EntityToDTO(e)).Where(e => e!= null).Cast<RescueTeamDTO>();
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

        /// <summary>
        /// Assigns an approved volunteer to a team with full business-rule validation and optional email.
        /// Business rules:
        ///   - Volunteer must have an Approved VolunteerProfile
        ///   - Volunteer must not be Suspended or Rejected
        ///   - Team must exist
        ///   - Sends email notification if notifyByEmail = true
        /// </summary>
        public async Task<RescueTeamMemberDTO?> AssignVolunteerToTeamAsync(
            int targetUserId,
            int teamId,
            int roleId,
            int assignedByManagerId,
            bool notifyByEmail,
            string? note)
        {
            const int StatusApproved = 1;

            // Validate: volunteer profile must exist and be approved
            var profile = await _volunteerProfileRepository.GetByUserId(targetUserId);
            if (profile == null)
                throw new InvalidOperationException("User has no volunteer profile.");
            if (profile.ApplicationStatus != StatusApproved)
                throw new InvalidOperationException($"Volunteer is not approved (status={profile.ApplicationStatus}). Only approved volunteers can be assigned to a team.");

            // Validate: team must exist
            var team = await _rescueTeamRepository.GetRescueTeamByTeamId(teamId);
            if (team == null)
                throw new InvalidOperationException($"Team {teamId} not found.");

            // Validate: member role must exist
            var memberRoles = await _rescueMembersRoleRepository.GetRescueMembersRoleById(roleId);
            if (memberRoles == null)
                throw new InvalidOperationException($"Team member role {roleId} not found.");

            // Create the membership record
            var member = new RescueTeamMember
            {
                UserId = targetUserId,
                TeamId = teamId,
                RoleId = roleId,
                AssignedAt = DateTime.UtcNow,
                AssignedByUserId = assignedByManagerId,
                IsActive = true
            };

            var created = await _rescueTeamMemberRepository.AddRescueTeamMember(member);
            if (created == null) return null;

            // Send email notification
            if (notifyByEmail)
            {
                try
                {
                    var user = await _userRepository.GetUserById(targetUserId);
                    if (user != null)
                    {
                        await _emailService.SendTeamAssignmentAsync(
                            to: user.Email,
                            volunteerName: user.FullName ?? "Tình nguyện viên",
                            teamName: team.TeamName,
                            assemblyLocation: team.AssemblyLocationText ?? "Chưa cập nhật",
                            roleInTeam: memberRoles.RoleName,
                            note: note);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RescueTeamService][AssignEmail] Warning: {ex.Message}");
                }
            }

            return MappingHandle.EntityToDTO(created);
        }
        #endregion
    }
}
