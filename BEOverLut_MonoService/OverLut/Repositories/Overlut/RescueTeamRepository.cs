using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueTeamRepository : IRescueTeamRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueTeamDAO _rescueTeamDAO;

        public RescueTeamRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueTeamDAO = new RescueTeamDAO(db);
        }
        public async Task<IEnumerable<RescueTeam>?> GetAllRescueTeam(int? teamId = null, string? teamName = null, int? statusId = null) => await _rescueTeamDAO.GetAllRescueTeam(teamId, teamName, statusId);

        public async Task<RescueTeam?> GetRescueTeamByTeamId(int teamId) => await _rescueTeamDAO.GetRescueTeamByTeamId(teamId);

        public Task<IEnumerable<RescueTeam>?> GetRescueTeamByUserId(int userId) => _rescueTeamDAO.GetRescueTeamByUserId(userId);

        public async Task<RescueTeam?> CreateRescueTeam(RescueTeam rescueTeam) => await _rescueTeamDAO.CreateRescueTeam(rescueTeam);

        public async Task<bool> UpdateRescueTeam(RescueTeam rescueTeam) => await _rescueTeamDAO.UpdateRescueTeam(rescueTeam);

        public async Task<bool> DeleteRescueTeamById(int teamId) => await _rescueTeamDAO.DeleteRescueTeamById(teamId);

        
    }
}
