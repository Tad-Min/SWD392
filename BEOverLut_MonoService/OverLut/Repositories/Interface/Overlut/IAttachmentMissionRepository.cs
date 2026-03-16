using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut
{
    public interface IAttachmentMissionRepository
    {
        Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithMissionId(int missionId);
        Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId);
        Task<bool> DeleteAttachmentMissionsById(Guid attachmentId);
        Task<AttachmentMission?> AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType);
    }
}
