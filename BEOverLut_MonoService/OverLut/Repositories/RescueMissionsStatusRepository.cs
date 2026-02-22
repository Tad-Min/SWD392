using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueMissionsStatusRepository : IRescueMissionsStatusRepository
    {
        public async Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName) => await RescueMissionsStatusDAO.GetAllRescueMissionsStatus(statusName);

        public async Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id) => await RescueMissionsStatusDAO.GetRescueMissionsStatusById(id);

        public async Task<RescueMissionsStatus?> CreateRescueMissionsStatus(RescueMissionsStatus status) => await RescueMissionsStatusDAO.CreateRescueMissionsStatus(status);

        public async Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatus status) => await RescueMissionsStatusDAO.UpdateRescueMissionsStatus(status);

        public async Task<bool> DeleteRescueMissionsStatus(int id) => await RescueMissionsStatusDAO.DeleteRescueMissionsStatus(id);
    }
}
