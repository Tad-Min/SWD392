using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueTeamMemberRepository
    {
        Task<IEnumerable<RescueTeamMember>?> GetAllRescueTeamMembersWithTeamId(int teamId);
        Task<RescueTeamMember?> AddRescueTeamMember(RescueTeamMember rescueTeamMember);
        Task<bool> UpdateRescueTeamMember(RescueTeamMember rescueTeamMember);
        Task<bool> DeleteRescueTeamMember(int userId, int teamId);
    }
}
