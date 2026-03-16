using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class VehiclesStatusRepository : IVehiclesStatusRepository
    {
        private readonly OverlutDbContext _db;
        private readonly VehiclesStatusDAO _vehiclesStatusDAO;

        public VehiclesStatusRepository(OverlutDbContext db)
        {
            _db = db;
            _vehiclesStatusDAO = new VehiclesStatusDAO(db);
        }
        public async Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName) => await _vehiclesStatusDAO.GetAll(statusName);

        public async Task<VehiclesStatus?> GetById(int id) => await _vehiclesStatusDAO.GetById(id);

        public async Task<VehiclesStatus?> Create(VehiclesStatus status) => await _vehiclesStatusDAO.Create(status);

        public async Task<bool> Update(VehiclesStatus status) => await _vehiclesStatusDAO.Update(status);

        public async Task<bool> Delete(int id) => await _vehiclesStatusDAO.Delete(id);
    }
}
