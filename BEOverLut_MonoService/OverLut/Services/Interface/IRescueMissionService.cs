using BusinessObject.OverlutEntiy;

namespace Services.Interface
{
    public interface IRescueMissionService
    {
        Task<IEnumerable<RescueMission>?> GetAllRescueMissionAsync(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description);
        Task<RescueMission?> GetRescueMissionByIdAsync(int id);
        Task<bool> UpdateRescueMissionAsync(RescueMission rescueMission, int updatedByUserId);
        Task<bool> DeleteRescueMissionAsync(int id);
        Task<RescueMission?> AddRescueMissionAsync(RescueMission rescueMission, int createdByUserId);
        Task<bool> AddAttachmentMissionAsync(AttachmentMission attachmentMission);
        Task<bool> DeleteAttachmentMissionByIdAsync(Guid id);
    }
}
