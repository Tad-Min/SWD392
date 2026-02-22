using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IVehiclesStatusRepository
    {
        Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName);
        Task<VehiclesStatus?> GetById(int id);
        Task<VehiclesStatus?> Create(VehiclesStatus status);
        Task<bool> Update(VehiclesStatus status);
        Task<bool> Delete(int id);
    }
}
