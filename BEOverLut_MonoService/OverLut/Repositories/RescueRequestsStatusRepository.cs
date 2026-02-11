using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestsStatusRepository : IRescueRequestsStatusRepository
    {
        public async Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName) => await RescueRequestsStatusDAO.GetAllRescueRequestsStatus(statusName);

        public async Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id) => await RescueRequestsStatusDAO.GetRescueRequestsStatusById(id);
    }
}
