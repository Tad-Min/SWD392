using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueTeamMemberRepository : IRescueTeamMemberRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueTeamMemberDAO _rescueTeamMemberDAO;

        public RescueTeamMemberRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueTeamMemberDAO = new RescueTeamMemberDAO(db);
        }
        public async Task<IEnumerable<RescueTeamMember>?> GetAllRescueTeamMembersWithTeamId(int teamId) => await _rescueTeamMemberDAO.GetAllRescueTeamMembersWithTeamId(teamId);

        public async Task<RescueTeamMember?> GetRescueTeamMemberByUserIdAndTeamId(int userId, int teamId) => await _rescueTeamMemberDAO.GetRescueTeamMemberByUserIdAndTeamId(userId, teamId);
        public async Task<RescueTeamMember?> AddRescueTeamMember(RescueTeamMember rescueTeamMember) => await _rescueTeamMemberDAO.AddRescueTeamMember(rescueTeamMember);

        public async Task<bool> UpdateRescueTeamMember(RescueTeamMember rescueTeamMember) => await _rescueTeamMemberDAO.UpdateRescueTeamMember(rescueTeamMember);

        public async Task<bool> DeleteRescueTeamMember(int userId, int teamId) => await _rescueTeamMemberDAO.DeleteRescueTeamMember(userId, teamId);

        
    }
}
