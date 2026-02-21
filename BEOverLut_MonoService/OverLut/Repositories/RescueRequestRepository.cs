using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class RescueRequestRepository : IRescueRequestRepository
    {
        public async Task<RescueRequest?> AddRescueRequest(RescueRequest? rescueRequest) => await RescueRequestDAO.AddRescueRequest(rescueRequest);

        public async Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description) => await RescueRequestDAO.GetAllRescueRequests(rescueRequestId, userReqId, requestType, urgencyLevel, status, description);
    }
}
