using System.Runtime.InteropServices;
using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class RescueRequestRepository : IRescueRequestRepository
    {
        private readonly OverlutDbContext _db;
        private readonly RescueRequestDAO _rescueRequestDAO;

        public RescueRequestRepository(OverlutDbContext db)
        {
            _db = db;
            _rescueRequestDAO = new RescueRequestDAO(db);
        }
        public async Task<RescueRequest?> GetRescueRequestByIdAsync(int id) => await _rescueRequestDAO.GetRescueRequestByIdAsync(id);
        public async Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description) => await _rescueRequestDAO.GetAllRescueRequests(rescueRequestId, userReqId, requestType, urgencyLevel, status, description);
        public async Task<RescueRequest?> AddRescueRequest(RescueRequest? rescueRequest) => await _rescueRequestDAO.AddRescueRequest(rescueRequest);
        public async Task<bool> UpdateRescueRequest(RescueRequest rescueRequest) => await _rescueRequestDAO.UpdateRescueRequest(rescueRequest);

    }
}
