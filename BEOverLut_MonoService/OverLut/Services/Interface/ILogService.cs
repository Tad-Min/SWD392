using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface ILogService
    {
        Task<RescueRequestLog?> AddRescueRequestLogAsync(RescueRequestLog rescueRequestLog);
        Task<MissionLog?> AddRescueMissionLogAsync(MissionLog missionLog);
        Task<IEnumerable<RescueRequestLog>?> GetAllRescueRequestLogsAsync();
        Task<IEnumerable<RescueRequestLog>?> GetAllRescueRequestLogsByIdAsync(int id);
        Task<IEnumerable<MissionLog>?> GetAllMissionLogsAsync();
        Task<IEnumerable<MissionLog>?> GetAllMissionLogsByIdAsync(int id);
    }
}
