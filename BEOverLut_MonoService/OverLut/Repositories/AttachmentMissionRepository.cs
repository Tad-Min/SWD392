using System;
using System.Collections.Generic;
using System.Text;
using BusinessObject.OverlutEntiy;
using DAOs.Overlut;
using Repositories.Interface;

namespace Repositories
{
    public class AttachmentMissionRepository : IAttachmentMissionRepository
    {
        public async Task<IEnumerable<AttachmentMission>> GetAllAttachmentMissionsWithMissionId(int missionId) => await AttachmentMissionDAO.GetAllAttachmentMissionsWithMissionId(missionId);

        public async Task<IEnumerable<AttachmentMission>> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId) => await AttachmentMissionDAO.GetAllAttachmentMissionsWithAttachmentId(attachmentId);

        public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId) => await AttachmentMissionDAO.DeleteAttachmentMissionsById(attachmentId);

        public async Task<AttachmentMission> AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType) => await AttachmentMissionDAO.AddAttachmentMissionsByMissionId(attachmentId, missionId, fileSize, fileType);
    }
}
