using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IVehiclesTypeRepository
    {
        Task<IEnumerable<VehiclesType>?> GetAllVehiclesType(string? typeName);
        Task<VehiclesType?> GetVehiclesTypeById(int id);
        Task<VehiclesType?> CreateVehiclesType(VehiclesType type);
        Task<bool> UpdateVehiclesType(VehiclesType type);
        Task<bool> DeleteVehiclesType(int id);
    }
}
