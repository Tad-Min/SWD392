using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class AttachmentRescueRepository : IAttachmentRescueRepository
    {
        public async Task<IEnumerable<AttachmentRescue>> GetAllAttachmentRescueWithRescueRequestId(int rescueRequestId) => await AttachmentRescueDAO.GetAllAttachmentRescueWithRescueRequestId(rescueRequestId);

        public async Task<IEnumerable<AttachmentRescue>> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId) => await AttachmentRescueDAO.GetAllAttachmentMissionsWithAttachmentId(attachmentId);

        public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId) => await AttachmentRescueDAO.DeleteAttachmentMissionsById(attachmentId);

        public async Task<AttachmentRescue> AddAttachmentMissionsByMissionId(Guid attachmentId, int rescueRequestId, long fileSize, String fileType) => await AttachmentRescueDAO.AddAttachmentMissionsByMissionId(attachmentId, rescueRequestId, fileSize, fileType);
    }
}
