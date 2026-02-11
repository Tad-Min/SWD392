using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueTeamRepository
    {
        Task<IEnumerable<RescueTeam>?> GetAllRescueTeam(int? teamId = null, string? teamName = null, int? statusId = null);
        Task<RescueTeam?> CreateRescueTeam(RescueTeam rescueTeam);
        Task<bool> UpdateRescueTeam(RescueTeam rescueTeam);
        Task<bool> DeleteRescueTeamById(int teamId);
    }
}
