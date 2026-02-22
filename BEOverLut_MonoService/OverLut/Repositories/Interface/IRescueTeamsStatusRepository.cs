using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueTeamsStatusRepository
    {
        Task<IEnumerable<RescueTeamsStatus>?> GetAllRescueTeamsStatus(string? statusName);
        Task<RescueTeamsStatus?> GetRescueTeamsStatusById(int id);
        Task<RescueTeamsStatus?> CreateRescueTeamsStatus(RescueTeamsStatus status);
        Task<bool> UpdateRescueTeamsStatus(RescueTeamsStatus status);
        Task<bool> DeleteRescueTeamsStatusById(int id);

    }
}
