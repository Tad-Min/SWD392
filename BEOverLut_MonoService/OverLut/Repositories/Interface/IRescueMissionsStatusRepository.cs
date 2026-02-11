using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMissionsStatusRepository
    {
        Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName);
        Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id);
    }
}
