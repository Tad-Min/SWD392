using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestsStatusRepository : IRescueRequestsStatusRepository
    {
        public async Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName) => await RescueRequestsStatusDAO.GetAllRescueRequestsStatus(statusName);

        public async Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id) => await RescueRequestsStatusDAO.GetRescueRequestsStatusById(id);

        public async Task<RescueRequestsStatus?> CreateRescueRequestsStatus(RescueRequestsStatus status) => await RescueRequestsStatusDAO.CreateRescueRequestsStatus(status);

        public async Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatus status) => await RescueRequestsStatusDAO.UpdateRescueRequestsStatus(status);

        public async Task<bool> DeleteRescueRequestsStatusById(int id) => await RescueRequestsStatusDAO.DeleteRescueRequestsStatusById(id);
    }
}
