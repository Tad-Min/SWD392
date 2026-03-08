using DAOs.OverlutStorage;
using DTOs;
using DTOs.OverlutStorage;
using Services.Interface;

namespace Services
{
    public class AttachmentStorageService : IAttachmentStorageService
    {
        public async Task<IEnumerable<AttachmentDTO>?> GetAllAttachments()
        {
            var attachments = await AttachmentDAO.GetAllAttachments();
            return attachments.Select(a => MappingHandle.EntityToDTO(a)).Where(a => a != null).Cast<AttachmentDTO>();
        }

        public async Task<AttachmentDTO?> GetAttachmentById(Guid attachmentId)
        {
            return MappingHandle.EntityToDTO(await AttachmentDAO.GetAttachmentById(attachmentId));
        }

        public async Task<AttachmentDTO?> CreateAttachment(AttachmentDTO dto)
        {
            return MappingHandle.EntityToDTO(await AttachmentDAO.CreateAttachment(MappingHandle.DTOToEntity(dto)!));
        }

        public async Task<bool> UpdateAttachment(AttachmentDTO dto)
        {
            return await AttachmentDAO.UpdateAttachment(MappingHandle.DTOToEntity(dto)!);
        }

        public async Task<bool> DeleteAttachment(Guid attachmentId)
        {
            return await AttachmentDAO.DeleteAttachment(attachmentId);
        }

        public async Task<Guid?> CreateAttachmentRescueAsync(int rescueRequestId, long fileSize, string fileType)
        {
            // Step 1: Create Attachment in OverlutDbStorage
            var attachmentDto = new AttachmentDTO { IsComplete = false, CreatedAt = DateTime.UtcNow };
            var createdAttachment = await AttachmentDAO.CreateAttachment(MappingHandle.DTOToEntity(attachmentDto)!);
            if (createdAttachment == null) return null;

            // Step 2: Create AttachmentRescue in Primary Database
            var repo = new Repositories.AttachmentRescueRepository();
            var addedRescue = await repo.AddAttachmentMissionsByMissionId(
                createdAttachment.AttachmentId, 
                rescueRequestId, 
                fileSize, 
                fileType
            );
            if (addedRescue == null) return null;

            return createdAttachment.AttachmentId;
        }

        public async Task<Guid?> CreateAttachmentMissionAsync(int missionId, long fileSize, string fileType)
        {
            // Step 1: Create Attachment in OverlutDbStorage
            var attachmentDto = new AttachmentDTO { IsComplete = false, CreatedAt = DateTime.UtcNow };
            var createdAttachment = await AttachmentDAO.CreateAttachment(MappingHandle.DTOToEntity(attachmentDto)!);
            if (createdAttachment == null) return null;

            // Step 2: Create AttachmentMission in Primary Database
            var repo = new Repositories.AttachmentMissionRepository();
            var addedMission = await repo.AddAttachmentMissionsByMissionId(
                createdAttachment.AttachmentId,
                missionId,
                fileSize,
                fileType
            );
            if (addedMission == null) return null;

            return createdAttachment.AttachmentId;
        }

        public async Task<bool> AddFileChunkAsync(Guid attachmentId, int sequenceNumber, byte[] data, bool isLastChunk)
        {
            // Step 3: Add chunk to FileChunk table
            var chunk = new BusinessObject.OverlutStorageEntiy.FileChunk
            {
                AttachmentId = attachmentId,
                SequenceNumber = sequenceNumber,
                Data = data
            };

            var createdChunk = await FileChunkDAO.CreateFileChunk(chunk);
            if (createdChunk == null) return false;

            // If last chunk, mark attachment as complete
            if (isLastChunk)
            {
                var existingAttachment = await AttachmentDAO.GetAttachmentById(attachmentId);
                if (existingAttachment != null)
                {
                    existingAttachment.IsComplete = true;
                    await AttachmentDAO.UpdateAttachment(existingAttachment);
                }
            }

            return true;
        }

        public async Task<IEnumerable<object>> GetAttachmentsByRescueRequestIdAsync(int rescueRequestId)
        {
            var repo = new Repositories.AttachmentRescueRepository();
            var links = await repo.GetAllAttachmentRescueWithRescueRequestId(rescueRequestId);
            if (links == null) return new List<object>();

            var result = new List<object>();
            foreach (var link in links)
            {
                var attachment = await AttachmentDAO.GetAttachmentById(link.AttachmentId);
                result.Add(new
                {
                    link.AttachmentId,
                    link.RescueRequestId,
                    link.FileSize,
                    link.FileType,
                    IsComplete = attachment?.IsComplete ?? false,
                    CreatedAt = attachment?.CreatedAt
                });
            }
            return result;
        }

        public async Task<IEnumerable<object>> GetAttachmentsByMissionIdAsync(int missionId)
        {
            var repo = new Repositories.AttachmentMissionRepository();
            var links = await repo.GetAllAttachmentMissionsWithMissionId(missionId);
            if (links == null) return new List<object>();

            var result = new List<object>();
            foreach (var link in links)
            {
                var attachment = await AttachmentDAO.GetAttachmentById(link.AttachmentId);
                result.Add(new
                {
                    link.AttachmentId,
                    link.MissionId,
                    link.FileSize,
                    link.FileType,
                    IsComplete = attachment?.IsComplete ?? false,
                    CreatedAt = attachment?.CreatedAt
                });
            }
            return result;
        }
    }
}
