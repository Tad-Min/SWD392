using DTOs.OverlutStorage;

namespace Services.Interface
{
    public interface IAttachmentStorageService
    {
        Task<IEnumerable<AttachmentDTO>?> GetAllAttachments();
        Task<AttachmentDTO?> GetAttachmentById(Guid attachmentId);
        Task<AttachmentDTO?> CreateAttachment(AttachmentDTO dto);
        Task<bool> UpdateAttachment(AttachmentDTO dto);
        Task<bool> DeleteAttachment(Guid attachmentId);
    }
}
