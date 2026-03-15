using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.OverlutStorageEntiy;
using DAOs;
using DAOs.Overlut;
using DAOs.OverlutStorage;
using Repositories.Interface.OverlutStorage;

namespace Repositories.OverlutStorage
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly OverlutDbStorageContext _db;
        private readonly AttachmentDAO _attachmentDAO;

        public AttachmentRepository(OverlutDbStorageContext db)
        {
            _db = db;
            _attachmentDAO = new AttachmentDAO(db);
        }
        public async Task<IEnumerable<Attachment>?> GetAllAttachments() => await _attachmentDAO.GetAllAttachments();

        public async Task<Attachment?> GetAttachmentById(Guid attachmentId) => await _attachmentDAO.GetAttachmentById(attachmentId);
        public async Task<Attachment?> CreateAttachment(Attachment attachment) => await _attachmentDAO.CreateAttachment(attachment);
        public async Task<bool> UpdateAttachment(Attachment attachment) => await _attachmentDAO.UpdateAttachment(attachment);
        public async Task<bool> DeleteAttachment(Guid attachmentId) => await _attachmentDAO.DeleteAttachment(attachmentId);
    }
}
