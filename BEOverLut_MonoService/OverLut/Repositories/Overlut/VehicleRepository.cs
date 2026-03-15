using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly OverlutDbContext _db;
        private readonly VehicleDAO _vehicleDAO;

        public VehicleRepository(OverlutDbContext db)
        {
            _db = db;
            _vehicleDAO = new VehicleDAO(db);
        }
        public async Task<IEnumerable<Vehicle>?> GetAllVehicles(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null) => await _vehicleDAO.GetAllVehicles(vehicleId, vehicleCode, vehicleType, capacity, statusId);

        public async Task<Vehicle?> GetVehicleById(int vehicleId) => await _vehicleDAO.GetVehicleById(vehicleId);

        public async Task<Vehicle?> AddVehicle(Vehicle vehicle) => await _vehicleDAO.AddVehicle(vehicle);

        public async Task<bool> UpdateVehicle(Vehicle vehicle) => await _vehicleDAO.UpdateVehicle(vehicle);

        public async Task<bool> DeleteVehicleById(int vehicleId) => await _vehicleDAO.DeleteVehicleById(vehicleId);
    }
}
