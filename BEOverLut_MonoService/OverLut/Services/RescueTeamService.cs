using BusinessObject.OverlutEntiy;
using Services.Interface;

namespace Services
{
    public class RescueTeamService : IRescueTeamService
    {
        public Task<RescueMembersRoll?> AddRescueMembersRollAsync(RescueMembersRoll rescueMembersRoll)
        {
            throw new NotImplementedException();
        }

        public Task<RescueTeamsStatus?> AddRescueTeamStatusAsync(RescueTeamsStatus rescueTeamsStatus)
        {
            throw new NotImplementedException();
        }

        public Task<RescueTeam?> AddTeamMemberAsync(RescueTeamMember rescueTeamMember)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteRescueMemberRollByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteRescueTeamStatusByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<RescueTeam?> DeleteTeamByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueMembersRoll>?> GetAllRescueMemberRollsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueTeam>?> GetAllRescueTeamsAsync(int? teamId, string? teamName, int? statusId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamStatusesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueTeamMember>?> GetAllTeamMemberAsync(int? teamId, string? teamName, int? statusId)
        {
            throw new NotImplementedException();
        }

        public Task<RescueMembersRoll?> GetRescueMembersRollByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<RescueTeamsStatus?> GetRescueTeamStatusByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<RescueTeam?> KickTeamMemberByMemberIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateRescueMembersRollAsync(RescueMembersRoll rescueMembersRoll)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateRescueTeamAsync(RescueTeam rescueTeam)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateRescueTeamStatusAsync(RescueTeamsStatus rescueTeamsStatus)
        {
            throw new NotImplementedException();
        }
    }
}
