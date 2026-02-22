using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMissionsStatusRepository
    {
        
        Task<IEnumerable<RescueMissionsStatus>?> GetAllRescueMissionsStatus(string? statusName);
        Task<RescueMissionsStatus?> GetRescueMissionsStatusById(int id);
        Task<RescueMissionsStatus?> CreateRescueMissionsStatus(RescueMissionsStatus status);
        Task<bool> UpdateRescueMissionsStatus(RescueMissionsStatus status);
        Task<bool> DeleteRescueMissionsStatus(int id);
        

    }
}
