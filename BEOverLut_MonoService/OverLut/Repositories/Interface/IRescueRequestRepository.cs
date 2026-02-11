using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestRepository
    {
        Task<RescueRequest?> AddRescueRequest(RescueRequest rescueRequest);
        Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description);
    }
}
