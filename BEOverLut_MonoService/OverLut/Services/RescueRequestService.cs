using BusinessObject.OverlutEntiy;
using Services.Interface;

namespace Services
{
    public class RescueRequestService : IRescueRequestService
    {
        public Task<bool> AddAttachmentRescueAsync(AttachmentRescue attachmentRescue)
        {
            throw new NotImplementedException();
        }

        public Task<RescueRequest?> AddRescueRequestAsync(RescueRequest rescueRequest)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAttachmentRescueByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteRescueRequestAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueRequest>?> GetAllRescueRequestsAsync(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description)
        {
            throw new NotImplementedException();
        }

        public Task<RescueRequest?> GetRescueRequestByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateRescueRequestAsync(RescueRequest rescueRequest)
        {
            throw new NotImplementedException();
        }
    }
}
