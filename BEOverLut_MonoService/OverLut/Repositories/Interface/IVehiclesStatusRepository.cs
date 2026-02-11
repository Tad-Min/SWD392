using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IVehiclesStatusRepository
    {
        Task<IEnumerable<VehiclesStatus>?> GetAll(string? statusName);
        Task<VehiclesStatus?> GetById(int id);
    }
}
