using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueTeamsStatusRepository
    {
        Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName);
        Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id);
    }
}
