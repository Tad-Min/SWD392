using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IRescueTeamService
    {
        Task<IEnumerable<RescueTeamDTO>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> GetRescueTeamByTeamId(int teamId);
        Task<RescueTeam?> CreateRescueTeamAsync(RescueTeam rescueTeam);
        Task<RescueTeam?> DeleteTeamByIdAsync(int id);
        Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberByTeamIdAsync(int? teamId);
        Task<RescueTeamMemberDTO?> GetRescueTeamMemberByUserIdAndTeamId(int userId, int teamId);
        Task<IEnumerable<RescueTeamDTO>?> GetRescueTeamByUserId(int userId);
        Task<RescueTeamMemberDTO?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember);
        Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam);
        Task<bool> DeleteRescueTeamMember(int userId, int teamId);

        /// <summary>
        /// Assigns an approved volunteer to a team. Validates approval status, sends email if requested.
        /// </summary>
        Task<RescueTeamMemberDTO?> AssignVolunteerToTeamAsync(
            int targetUserId,
            int teamId,
            int roleId,
            int assignedByManagerId,
            bool notifyByEmail,
            string? note);
    }
}
