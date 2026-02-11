using Services.Interface;

namespace Services
{
    public class AttachmentStorageService : IAttachmentStorageService
    {
        public Task<byte[]?> GetAttachmentbyId(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
