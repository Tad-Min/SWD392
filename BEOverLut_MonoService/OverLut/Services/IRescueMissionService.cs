using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Services
{
    internal interface IRescueMissionService
    {
        Task<IEnumerable<RescueMission>?> GetAllRescueMissionAsync(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId);
        Task<RescueRequest?> GetRescueMissionByIdAsync(int id);
        Task<bool> UpdateRescueMissionAsync(RescueMission rescueMission);
        Task<bool> DeleteRescueMissionAsync(int id);
        Task<RescueRequest?> AddRescueMissionAsync(RescueRequest rescueRequest);
        Task<bool> AddAttachmentMissionAsync(AttachmentMission attachmentMission);
        Task<bool> DeleteAttachmentMissionByIdAsync(Guid id);
    }
}
