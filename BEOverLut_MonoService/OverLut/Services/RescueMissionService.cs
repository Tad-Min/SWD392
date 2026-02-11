using BusinessObject.OverlutEntiy;
using Services.Interface;

namespace Services
{
    public class RescueMissionService : IRescueMissionService
    {
        public Task<bool> AddAttachmentMissionAsync(AttachmentMission attachmentMission)
        {
            throw new NotImplementedException();
        }

        public Task<RescueRequest?> AddRescueMissionAsync(RescueRequest rescueRequest)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAttachmentMissionByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteRescueMissionAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<RescueMission>?> GetAllRescueMissionAsync(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId)
        {
            throw new NotImplementedException();
        }

        public Task<RescueRequest?> GetRescueMissionByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateRescueMissionAsync(RescueMission rescueMission)
        {
            throw new NotImplementedException();
        }
    }
}
