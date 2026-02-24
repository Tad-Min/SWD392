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
    }
}
