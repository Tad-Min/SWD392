using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueTeamsStatusRepository : IRescueTeamsStatusRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueTeamsStatusDAO _rescueTeamsStatusDAO;

        public RescueTeamsStatusRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueTeamsStatusDAO = new RescueTeamsStatusDAO(db);
        }
        public async Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName) => await _rescueTeamsStatusDAO.GetAllRescueTeamsStatus(statusName);

        public async Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id) => await _rescueTeamsStatusDAO.GetRescueTeamsStatusById(id);

        public async Task<RescueTeamsStatus?> CreateRescueTeamsStatus(RescueTeamsStatus status) => await _rescueTeamsStatusDAO.CreateRescueTeamsStatus(status);

        public async Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatus status) => await _rescueTeamsStatusDAO.UpdateRescueTeamsStatus(status);

        public async Task<bool> DeleteRescueTeamsStatusById(int id) => await _rescueTeamsStatusDAO.DeleteRescueTeamsStatusById(id);
    }
}
