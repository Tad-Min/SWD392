using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueRequestLogRepository : IRescueRequestLogRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueRequestLogDAO _rescueRequestLogDAO;

        public RescueRequestLogRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueRequestLogDAO = new RescueRequestLogDAO(db);
        }
        public async Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog) => await _rescueRequestLogDAO.AddRescueRequestLog(rescueRequestLog);

        public async Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId) => await _rescueRequestLogDAO.GetRescueRequestLogByRescueRequestId(rescueRequestId);

        public async Task<IEnumerable<RescueRequestLog>?> GetAllRescueRequestLogs() => await _rescueRequestLogDAO.GetAllRescueRequestLogs();
    }
}
