using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class VehiclesStatusRepository : IVehiclesStatusRepository
    {
        public async Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName) => await VehiclesStatusDAO.GetAll(statusName);

        public async Task<VehiclesStatus?> GetById(int id) => await VehiclesStatusDAO.GetById(id);
    }
}
