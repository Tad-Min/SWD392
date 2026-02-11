using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestsTypeRepository
    {
        Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName);
        Task<RescueRequestsType?> GetRescueRequestsTypeById(int id);
    }
}
