using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueRequestsStatusRepository : IRescueRequestsStatusRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueRequestsStatusDAO _rescueRequestsStatusDAO;

        public RescueRequestsStatusRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueRequestsStatusDAO = new RescueRequestsStatusDAO(db);
        }
        public async Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName) => await _rescueRequestsStatusDAO.GetAllRescueRequestsStatus(statusName);

        public async Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id) => await _rescueRequestsStatusDAO.GetRescueRequestsStatusById(id);

        public async Task<RescueRequestsStatus?> CreateRescueRequestsStatus(RescueRequestsStatus status) => await _rescueRequestsStatusDAO.CreateRescueRequestsStatus(status);

        public async Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatus status) => await _rescueRequestsStatusDAO.UpdateRescueRequestsStatus(status);

        public async Task<bool> DeleteRescueRequestsStatusById(int id) => await _rescueRequestsStatusDAO.DeleteRescueRequestsStatusById(id);
    }
}
