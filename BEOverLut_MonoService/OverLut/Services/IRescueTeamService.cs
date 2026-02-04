using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IRescueTeamService
    {
        Task<IEnumerable<RescueTeam>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> DeleteTeamByIdAsync(int id);
        Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberAsync(int? teamId, string? teamName, int? statusId);
        Task<RescueTeam?> KickTeamMemberByMemberIdAsync(int id);
        Task<RescueTeam?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember);
        Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam);
        #region Rescue Members Roll
        Task<IEnumerable<RescueMembersRoll>?> GetAllRescueMemberRollsAsync();
        Task<RescueMembersRoll?> GetRescueMembersRollByIdAsync(int id);
        Task<RescueMembersRoll?> AddRescueMembersRollAsync(RescueMembersRoll rescueMembersRoll);
        Task<bool> UpdateRescueMembersRollAsync(RescueMembersRoll rescueMembersRoll);
        Task<bool> DeleteRescueMemberRollByIdAsync(int id);
        #endregion
        #region rescue status
        Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamStatusesAsync();
        Task<RescueTeamsStatus?> GetRescueTeamStatusByIdAsync(int id);
        Task<RescueTeamsStatus?> AddRescueTeamStatusAsync(RescueTeamsStatus rescueTeamsStatus);
        Task<bool> UpdateRescueTeamStatusAsync(RescueTeamsStatus rescueTeamsStatus);
        Task<bool> DeleteRescueTeamStatusByIdAsync(int id);
        #endregion

    }
}
