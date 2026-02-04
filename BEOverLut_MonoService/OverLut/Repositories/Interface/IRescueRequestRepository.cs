using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IRescueRequestRepository
    {
        Task<RescueRequest?> AddRescueRequest(RescueRequest rescueRequest);
        Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description);
    }
}
