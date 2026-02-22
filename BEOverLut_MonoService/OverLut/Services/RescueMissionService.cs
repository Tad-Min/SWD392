using BusinessObject.OverlutEntiy;
using Repositories.Interface;
using Services.Interface;
using System.Text.Json;

namespace Services
{
    public class RescueMissionService : IRescueMissionService
    {
        private readonly IRescueMissionRepository _rescueMissionRepository;
        private readonly IMissionLogRepository _missionLogRepository;
        private readonly IAttachmentMissionRepository _attachmentMissionRepository;

        public RescueMissionService(
            IRescueMissionRepository rescueMissionRepository,
            IMissionLogRepository missionLogRepository,
            IAttachmentMissionRepository attachmentMissionRepository)
        {
            _rescueMissionRepository = rescueMissionRepository;
            _missionLogRepository = missionLogRepository;
            _attachmentMissionRepository = attachmentMissionRepository;
        }

        public Task<bool> AddAttachmentMissionAsync(AttachmentMission attachmentMission)
        {
             // Repository expects Guid attachmentId, int missionId, long fileSize, String fileType
             // But the interface for repo is weird: AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType)
             // So I'll just call it.
             return _attachmentMissionRepository.AddAttachmentMissionsByMissionId(
                 attachmentMission.AttachmentId, 
                 attachmentMission.MissionId, 
                 attachmentMission.FileSize, 
                 attachmentMission.FileType)
                 .ContinueWith(t => t.Result != null);
        }

        public async Task<RescueMission?> AddRescueMissionAsync(RescueMission rescueMission, int createdByUserId)
        {
            rescueMission.CoordinatorUserId = createdByUserId;
            rescueMission.AssignedAt = DateTime.UtcNow;
            
            // Set default status if needed, assuming status 1 is pending/assigned.
            // But usually created via controller with explicit status or default.
            // If status is 0, maybe set a default? The repo might handle it or DB default.
            if (rescueMission.StatusId == 0) rescueMission.StatusId = 1; 

            var addedMission = await _rescueMissionRepository.CreateRescueMission(rescueMission);
            
            if (addedMission != null)
            {
                var log = new MissionLog
                {
                    MissionId = addedMission.MissionId,
                    OldRescueMissions = "Created", // Or serializing something? usually null for creation.
                    ChangedByUserId = createdByUserId,
                    ChangedAt = DateTime.UtcNow
                };
                await _missionLogRepository.AddMissionLog(log);
            }
            return addedMission;
        }

        public Task<bool> DeleteAttachmentMissionByIdAsync(Guid id)
        {
            return _attachmentMissionRepository.DeleteAttachmentMissionsById(id);
        }

        public Task<bool> DeleteRescueMissionAsync(int id)
        {
            return _rescueMissionRepository.DeleteRescueMission(id);
        }

        public Task<IEnumerable<RescueMission>?> GetAllRescueMissionAsync(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description)
        {
            return _rescueMissionRepository.GetAllRescueMission(missionId, rescueRequestId, coordinatorUserId, teamId, statusId, description);
        }

        public Task<RescueMission?> GetRescueMissionByIdAsync(int id)
        {
            // The repo has GetAllRescueMission, usually GetById is implemented via GetAll with ID filter or specific method.
            // But wait, Repository has GetAllRescueMission(int? missionId, ...)
            // It doesn't have GetRescueMissionById explicitly?
            // Let's check IRescueMissionRepository again.
            // It has GetAllRescueMission(...). No GetById.
            // So I use GetAll with missionId.
            return _rescueMissionRepository.GetAllRescueMission(id, null, null, null, null, null)
                .ContinueWith(t => t.Result?.FirstOrDefault());
        }

        public async Task<bool> UpdateRescueMissionAsync(RescueMission rescueMission, int updatedByUserId)
        {
            // Need to get old mission for log
            var oldMissions = await _rescueMissionRepository.GetAllRescueMission(rescueMission.MissionId, null, null, null, null, null);
            var oldMission = oldMissions?.FirstOrDefault();
            
            if (oldMission == null) return false;

            string oldData = JsonSerializer.Serialize(oldMission);

            // Update fields
            oldMission.StatusId = rescueMission.StatusId;
            oldMission.Description = rescueMission.Description;
            oldMission.TeamId = rescueMission.TeamId;
            // Coordinator might change? If so:
            // oldMission.CoordinatorUserId = rescueMission.CoordinatorUserId; 
            // The controller passes the current user as coordinator for updates?
            // "UpdateRescueMisstion(UpdateRescueMisstionModel model). coordinatorUserId get from ClaimTypes.NameIdentifier"
            // Usually updates are done by the coordinator, so they stay the coordinator. 
            // Or maybe assigning to another coordinator?
            // The model doesn't have CoordinatorUserId. So it stays same?
            // But the controller says "coordinatorUserId get from ClaimTypes". This implies passing it to service.
            // If I pass it to service as updatedByUserId, it's for logging.
            // I will assume only fields in the model are updated.

            var result = await _rescueMissionRepository.UpdateRescueMission(oldMission);
            
            if (result)
            {
                var log = new MissionLog
                {
                    MissionId = rescueMission.MissionId,
                    OldRescueMissions = oldData,
                    ChangedByUserId = updatedByUserId,
                    ChangedAt = DateTime.UtcNow
                };
                await _missionLogRepository.AddMissionLog(log);
            }

            return result;
        }
    }
}
