using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IRescueRequestServices
    {
        Task<IEnumerable<RescueRequest>?> GetAllRescueRequestsAsync(
            int? rescueRequestId,
            int? userReqId,
            int? requestType,
            int? urgencyLevel,
            int? status,
            string? description);
        Task<RescueRequest?> GetRescueRequestByIdAsync(int id);
        Task<bool> UpdateRescueRequestAsync(RescueRequest rescueRequest);
        Task<bool> DeleteRescueRequestAsync(int id);
        Task<RescueRequest?> AddRescueRequestAsync(RescueRequest rescueRequest);
        Task<bool> AddAttachmentRescueAsync(AttachmentRescue attachmentRescue);
        Task<bool> DeleteAttachmentRescueByIdAsync(Guid id);
    }
}
