using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutStorageEntiy;

namespace Repositories.Interface.OverlutStorage
{
    public interface IAttachmentRepository
    {
        Task<IEnumerable<Attachment>?> GetAllAttachments();
        Task<Attachment?> GetAttachmentById(Guid attachmentId);
        Task<Attachment?> CreateAttachment(Attachment attachment);
        Task<bool> UpdateAttachment(Attachment attachment);
        Task<bool> DeleteAttachment(Guid attachmentId);
    }
}
