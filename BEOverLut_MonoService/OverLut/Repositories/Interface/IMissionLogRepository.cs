using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IMissionLogRepository
    {
        Task<MissionLog?> AddMissionLog(MissionLog missionLog);
        Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId);
    }
}
