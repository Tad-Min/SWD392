using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut
{
    public interface IMissionLogRepository
    {
        Task<MissionLog?> AddMissionLog(MissionLog missionLog);
        Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId);
        Task<IEnumerable<MissionLog>?> GetAllMissionLogs();
    }
}
