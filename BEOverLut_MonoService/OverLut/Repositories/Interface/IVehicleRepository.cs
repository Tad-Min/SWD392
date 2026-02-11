using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>?> GetAllVehicles(int? vehicleId = null, string? vehicleCode = null, int? vehicleType = null, int? capacity = null, int? statusId = null);
        Task<Vehicle?> GetVehicleById(int vehicleId);
        Task<Vehicle?> AddVehicle(Vehicle vehicle);
        Task<bool> UpdateVehicle(Vehicle vehicle);
        Task<bool> DeleteVehicleById(int vehicleId);
    }
}
