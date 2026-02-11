using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestsStatusRepository
    {
        Task<IEnumerable<RescueRequestsStatus>?> GetAllRescueRequestsStatus(string? statusName);
        Task<RescueRequestsStatus?> GetRescueRequestsStatusById(int id);
    }
}
