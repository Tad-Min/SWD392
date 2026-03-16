using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class MissionLogRepository : IMissionLogRepository
    {
        private readonly OverlutDbContext _db;
        private readonly MissionLogDAO _missionLogDAO;

        public MissionLogRepository(OverlutDbContext db)
        {
            _db = db;
            _missionLogDAO = new MissionLogDAO(db);
        }
        public async Task<MissionLog?> AddMissionLog(MissionLog missionLog) => await _missionLogDAO.AddMissionLog(missionLog);

        public async Task<IEnumerable<MissionLog>?> GetMissionLogByMissionId(int missionId) => await _missionLogDAO.GetMissionLogByMissionId(missionId);

        public async Task<IEnumerable<MissionLog>?> GetAllMissionLogs() => await _missionLogDAO.GetAllMissionLogs();
    }
}
