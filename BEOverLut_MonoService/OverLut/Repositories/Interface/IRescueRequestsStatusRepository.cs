using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestsStatusRepository
    {
        Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName);
        Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id);
        Task<RescueRequestsStatus?> CreateRescueRequestsStatus(RescueRequestsStatus status);
        Task<bool> UpdateRescueRequestsStatus(RescueRequestsStatus status);
        Task<bool> DeleteRescueRequestsStatusById(int id);
    }
}
