using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestLogRepository
    {
        Task<RescueRequestLog?> AddRescueRequestLog(RescueRequestLog rescueRequestLog);
        Task<IEnumerable<RescueRequestLog>?> GetRescueRequestLogByRescueRequestId(int rescueRequestId);
    }
}
