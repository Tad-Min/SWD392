using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestsTypeRepository
    {
        Task<IEnumerable<RescueRequestsType>?> GetAllRescueRequestsType(string? typeName);
        Task<RescueRequestsType?> GetRescueRequestsTypeById(int id);
        Task<RescueRequestsType?> CreateRescueRequestsType(RescueRequestsType type);
        Task<bool> UpdateRescueRequestsType(RescueRequestsType type);
        Task<bool> DeleteRescueRequestsType(int id);
    }
}
