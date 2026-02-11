using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueMissionRepository
    {
        Task<IEnumerable<RescueMission>?> GetAllRescueMission(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId);
        Task<RescueMission?> CreateRescueMission(RescueMission mission);
        Task<bool> UpdateRescueMission(RescueMission mission);
        Task<bool> DeleteRescueMission(int missionId);
    }
}
