using System.Text.Json;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Repositories.Interface.Overlut;
using Services.Interface;

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

        public async Task<IEnumerable<RescueMissionDTO>?> GetAllRescueMissionAsync(int? missionId, int? rescueRequestId, int? coordinatorUserId, int? teamId, int? statusId, string? description)
        {
            var result = await _rescueMissionRepository.GetAllRescueMission(missionId, rescueRequestId, coordinatorUserId, teamId, statusId, description);
            if (result == null) return new List<RescueMissionDTO>();

            return result.Select(x => MappingHandle.EntityToDTO(x)).Where(x => x != null).Cast <RescueMissionDTO>();
        }

        public Task<RescueMission?> GetRescueMissionByIdAsync(int id)
        {

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

            
            oldMission.StatusId = rescueMission.StatusId;
            oldMission.Description = rescueMission.Description;
            oldMission.TeamId = rescueMission.TeamId;

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
