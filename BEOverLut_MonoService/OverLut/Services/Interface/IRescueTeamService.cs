using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IRescueTeamService
    {
        Task<IEnumerable<RescueTeam>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> GetRescueTeamByTeamId(int teamId);
        Task<RescueTeam?> CreateRescueTeamAsync(RescueTeam rescueTeam);
        Task<RescueTeam?> DeleteTeamByIdAsync(int id);
        Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberByTeamIdAsync(int? teamId);
        Task<RescueTeamMemberDTO?> GetRescueTeamMemberByUserIdAndTeamId(int userId, int teamId);

        Task<IEnumerable<RescueTeamDTO>?> GetRescueTeamByUserId(int userId);
        Task<RescueTeam?> KickTeamMemberByMemberIdAsync(int id);
        Task<RescueTeamMemberDTO?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember);
        Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam);
        #region Rescue Members Roll
        Task<IEnumerable<RescueMembersRoleDTO>?> GetAllRescueMemberRolesAsync(int? id, string? name);
        Task<RescueMembersRole?> GetRescueMembersRoleByIdAsync(int id);
        Task<RescueMembersRole?> AddRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll);
        Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll);
        Task<bool> DeleteRescueMemberRoleByIdAsync(int id);
        #endregion
    }
}
