using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueTeamsStatusRepository : IRescueTeamsStatusRepository
    {
        public async Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName) => await RescueTeamsStatusDAO.GetAllRescueTeamsStatus(statusName);

        public async Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id) => await RescueTeamsStatusDAO.GetRescueTeamsStatusById(id);

        public async Task<RescueTeamsStatus?> CreateRescueTeamsStatus(RescueTeamsStatus status) => await RescueTeamsStatusDAO.CreateRescueTeamsStatus(status);

        public async Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatus status) => await RescueTeamsStatusDAO.UpdateRescueTeamsStatus(status);

        public async Task<bool> DeleteRescueTeamsStatusById(int id) => await RescueTeamsStatusDAO.DeleteRescueTeamsStatusById(id);
    }
}
