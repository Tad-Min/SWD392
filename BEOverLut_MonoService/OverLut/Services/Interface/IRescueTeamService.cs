using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface IRescueTeamService
    {
        Task<IEnumerable<RescueTeam>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> DeleteTeamByIdAsync(int id);
        Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> KickTeamMemberByMemberIdAsync(int id);
        Task<RescueTeam?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember);
        Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam);
        #region Rescue Members Roll
        Task<IEnumerable<RescueMembersRole>?> GetAllRescueMemberRollsAsync();
        Task<RescueMembersRole?> GetRescueMembersRoleByIdAsync(int id);
        Task<RescueMembersRole?> AddRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll);
        Task<bool> UpdateRescueMembersRoleAsync(RescueMembersRole rescueMembersRoll);
        Task<bool> DeleteRescueMemberRollByIdAsync(int id);
        #endregion
    }
}
