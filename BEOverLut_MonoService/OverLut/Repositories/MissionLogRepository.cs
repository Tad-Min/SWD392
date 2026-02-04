using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class MissionLogRepository : IMissionLogRepository
    {
        public async Task<MissionLog?> AddMissionLog(MissionLog missionLog) => await MissionLogDAO.AddMissionLog(missionLog);

        public async Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId) => await MissionLogDAO.GetMissionLogByMissionId(missionId);
    }
}
