using System.Text.Json;
using System.Text.Json.Nodes;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Appsettings;

using DTOs.Overlut;
using Microsoft.Extensions.Options;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class RescueRequestService : IRescueRequestService
    {
        private IRescueRequestRepository iRescueRequestRepository;

        private IRescueRequestLogRepository iRescueRequestLogRepository;
        private RescueReqSettings rescueReqSettings;

        public RescueRequestService(
            IRescueRequestLogRepository iRescueRequestLogRepository,
            IRescueRequestRepository iRescueRequestRepository,
            IOptions<RescueReqSettings> rescueReqSettings)
        {
            this.iRescueRequestRepository = iRescueRequestRepository;
            this.iRescueRequestLogRepository = iRescueRequestLogRepository;
            this.rescueReqSettings = rescueReqSettings.Value;
        }

        public Task<bool> AddAttachmentRescueAsync(AttachmentRescue attachmentRescue)
        {
            throw new NotImplementedException();
        }

        public async Task<RescueRequestDTO?> AddRescueRequestAsync(RescueRequestDTO rescueRequest)
        {
            rescueRequest.Status = rescueReqSettings.DefaultStatusId;
            var dto = MappingHandle.EntityToDTO(await iRescueRequestRepository.AddRescueRequest(MappingHandle.DTOToEntity(rescueRequest)));
            
            if (dto != null && await iRescueRequestLogRepository.AddRescueRequestLog(new RescueRequestLog {RescueRequestId = dto.RescueRequestId }) == null)
            {
                throw new Exception("Can't write log");
            }
            ;
            return dto;
        }

        public Task<bool> DeleteAttachmentRescueByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }


        public async Task<IEnumerable<RescueRequestDTO>?> GetAllRescueRequestsAsync(int? rescueRequestId, int? userReqId, int? requestType, int? urgencyLevel, int? status, string? description)
        {
            var requests = await iRescueRequestRepository.GetAllRescueRequests(rescueRequestId, userReqId, requestType, urgencyLevel, status, description);
            if (requests == null) return null;
            return requests.Select(x => MappingHandle.EntityToDTO(x)).OfType<RescueRequestDTO>();
        }

        public Task<RescueRequest?> GetRescueRequestByIdAsync(int id)
        {
            return iRescueRequestRepository.GetRescueRequestByIdAsync(id);
        }

        public async Task<bool> UpdateRescueRequestAsync(RescueRequestDTO model)
        {
            return await iRescueRequestRepository.UpdateRescueRequest(MappingHandle.DTOToEntity(model)!);
        }
    }
}
