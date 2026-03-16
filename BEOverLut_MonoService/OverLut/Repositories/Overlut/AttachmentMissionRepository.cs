using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class AttachmentMissionRepository : IAttachmentMissionRepository
    {
        private readonly OverlutDbContext _db;
        private readonly AttachmentMissionDAO _attachmentMissionDAO;

        public AttachmentMissionRepository(OverlutDbContext db)
        {
            _db = db;
            _attachmentMissionDAO = new AttachmentMissionDAO(db);
        }
        public async Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithMissionId(int missionId) => await _attachmentMissionDAO.GetAllAttachmentMissionsWithMissionId(missionId);

        public async Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId) => await _attachmentMissionDAO.GetAllAttachmentMissionsWithAttachmentId(attachmentId);

        public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId) => await _attachmentMissionDAO.DeleteAttachmentMissionsById(attachmentId);

        public async Task<AttachmentMission?> AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType) => await _attachmentMissionDAO.AddAttachmentMissionsByMissionId(attachmentId, missionId, fileSize, fileType);
    }
}
