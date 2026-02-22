using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    public interface IRescueRequestRepository
    {
        Task<RescueRequest?> GetRescueRequestByIdAsync(int id);
        Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description);
        Task<RescueRequest?> AddRescueRequest(RescueRequest? rescueRequest);
        Task<bool> UpdateRescueRequest(RescueRequest rescueRequest);
    }
}
