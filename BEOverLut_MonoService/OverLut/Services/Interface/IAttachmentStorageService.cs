namespace Services.Interface
{
    public interface IAttachmentStorageService
    {
        Task<byte[]?> GetAttachmentbyId(Guid id);
    }
}
