using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut
{
    public class AttachmentRescueRepository : IAttachmentRescueRepository
    {
        private readonly OverlutDbContext _db;
        private readonly AttachmentRescueDAO _attachmentRescueDAO;

        public AttachmentRescueRepository(OverlutDbContext db)
        {
            _db = db;
            _attachmentRescueDAO = new AttachmentRescueDAO(db);
        }
        public async Task<IEnumerable<AttachmentRescue>?> GetAllAttachmentRescueWithRescueRequestId(int rescueRequestId) => await _attachmentRescueDAO.GetAllAttachmentRescueWithRescueRequestId(rescueRequestId);

        public async Task<IEnumerable<AttachmentRescue>?> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId) => await _attachmentRescueDAO.GetAllAttachmentMissionsWithAttachmentId(attachmentId);

        public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId) => await _attachmentRescueDAO.DeleteAttachmentMissionsById(attachmentId);

        public async Task<AttachmentRescue?> AddAttachmentMissionsByMissionId(Guid attachmentId, int rescueRequestId, long fileSize, String fileType) => await _attachmentRescueDAO.AddAttachmentMissionsByMissionId(attachmentId, rescueRequestId, fileSize, fileType);
    }
}
