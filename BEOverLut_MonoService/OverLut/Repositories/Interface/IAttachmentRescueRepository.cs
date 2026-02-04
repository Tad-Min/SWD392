using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;

namespace Repositories.Interface
{
    internal interface IAttachmentRescueRepository
    {
        Task<IEnumerable<AttachmentRescue>> GetAllAttachmentRescueWithRescueRequestId(int rescueRequestId);
        Task<IEnumerable<AttachmentRescue>> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId);
        Task<bool> DeleteAttachmentMissionsById(Guid attachmentId);
        Task<AttachmentRescue> AddAttachmentMissionsByMissionId(Guid attachmentId, int rescueRequestId, long fileSize, String fileType);
    }
}
