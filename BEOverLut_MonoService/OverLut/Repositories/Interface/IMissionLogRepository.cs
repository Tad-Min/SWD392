using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IMissionLogRepository
    {
        Task<MissionLog?> AddMissionLog(MissionLog missionLog);
        Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId);
    }
}
