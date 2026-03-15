using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class VehiclesTypeRepository : IVehiclesTypeRepository
    {
        private readonly OverlutDbContext _db;
        private readonly VehiclesTypeDAO _vehiclesTypeDAO;

        public VehiclesTypeRepository(OverlutDbContext db)
        {
            _db = db;
            _vehiclesTypeDAO = new VehiclesTypeDAO(db);
        }
        public async Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName) => await _vehiclesTypeDAO.GetAllVehiclesType(typeName);

        public async Task<VehiclesType?> GetVehiclesTypeById(int id) => await _vehiclesTypeDAO.GetVehiclesTypeById(id);

        public async Task<VehiclesType?> CreateVehiclesType(VehiclesType type) => await _vehiclesTypeDAO.CreateVehiclesType(type);

        public async Task<bool> UpdateVehiclesType(VehiclesType type) => await _vehiclesTypeDAO.UpdateVehiclesType(type);

        public async Task<bool> DeleteVehiclesType(int id) => await _vehiclesTypeDAO.DeleteVehiclesTypeById(id);
    }
}
