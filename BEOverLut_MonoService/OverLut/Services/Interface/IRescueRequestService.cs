using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface
{
    public interface IRescueRequestService
    {
        Task<IEnumerable<RescueRequestDTO>?> GetAllRescueRequestsAsync(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description);
        Task<RescueRequest?> GetRescueRequestByIdAsync(int id);
        Task<bool> UpdateRescueRequestAsync(RescueRequestDTO rescueRequest);
        Task<RescueRequestDTO?> AddRescueRequestAsync(RescueRequestDTO rescueRequest);
        Task<bool> AddAttachmentRescueAsync(AttachmentRescue attachmentRescue);
        Task<bool> DeleteAttachmentRescueByIdAsync(Guid id);
    }
}
