using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class LogService : ILogService
    {
        private readonly IRescueRequestLogRepository _rescueRequestLogRepository;
        private readonly IMissionLogRepository _missionLogRepository;

        public LogService(IRescueRequestLogRepository rescueRequestLogRepository, IMissionLogRepository missionLogRepository)
        {
            _rescueRequestLogRepository = rescueRequestLogRepository;
            _missionLogRepository = missionLogRepository;
        }

        public async Task<RescueRequestLog?> AddRescueRequestLogAsync(RescueRequestLog rescueRequestLog)
        {
            return await _rescueRequestLogRepository.AddRescueRequestLog(rescueRequestLog);
        }

        public async Task<MissionLog?> AddRescueMissionLogAsync(MissionLog missionLog)
        {
            return await _missionLogRepository.AddMissionLog(missionLog);
        }

        public async Task<IEnumerable<RescueRequestLog>?> GetAllRescueRequestLogsByIdAsync(int id)
        {
            return await _rescueRequestLogRepository.GetRescueRequestLogByRescueRequestId(id);
        }

        public async Task<IEnumerable<MissionLog>?> GetAllMissionLogsByIdAsync(int id)
        {
            return await _missionLogRepository.GetMissionLogByMissionId(id);
        }
    }
}
