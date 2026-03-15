using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueMissionsStatusRepository : IRescueMissionsStatusRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueMissionsStatusDAO _rescueMissionsStatusDAO;

        public RescueMissionsStatusRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueMissionsStatusDAO = new RescueMissionsStatusDAO(db);
        }
        public async Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName) => await _rescueMissionsStatusDAO.GetAllRescueMissionsStatus(statusName);

        public async Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id) => await _rescueMissionsStatusDAO.GetRescueMissionsStatusById(id);

        public async Task<RescueMissionsStatus?> CreateRescueMissionsStatus(RescueMissionsStatus status) => await _rescueMissionsStatusDAO.CreateRescueMissionsStatus(status);

        public async Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatus status) => await _rescueMissionsStatusDAO.UpdateRescueMissionsStatus(status);

        public async Task<bool> DeleteRescueMissionsStatus(int id) => await _rescueMissionsStatusDAO.DeleteRescueMissionsStatus(id);
    }
}
