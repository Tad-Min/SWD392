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

        // New chunked upload methods
        Task<Guid?> CreateAttachmentRescueAsync(int rescueRequestId, long fileSize, string fileType);
        Task<Guid?> CreateAttachmentMissionAsync(int missionId, long fileSize, string fileType);
        Task<bool> AddFileChunkAsync(Guid attachmentId, int sequenceNumber, byte[] data, bool isLastChunk);
        
        // Fetch APIs
        Task<IEnumerable<object>> GetAttachmentsByRescueRequestIdAsync(int rescueRequestId);
        Task<IEnumerable<object>> GetAttachmentsByMissionIdAsync(int missionId);
    }
}
