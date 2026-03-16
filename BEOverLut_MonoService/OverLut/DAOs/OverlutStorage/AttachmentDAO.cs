using BusinessObject.OverlutStorageEntiy;
using DAOs.Overlut;
using Microsoft.EntityFrameworkCore;

namespace DAOs.OverlutStorage;

public class AttachmentDAO
{
    private readonly OverlutDbStorageContext _db;

    public AttachmentDAO(OverlutDbStorageContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<Attachment>?> GetAllAttachments()
    {
        try
        {
            return await _db.Attachments.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-GetAllAttachments: {ex.Message}");
            return null;
        }
    }

    public async Task<Attachment?> GetAttachmentById(Guid attachmentId)
    {
        try
        {
            return await _db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachmentId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-GetAttachmentById: {ex.Message}");
            return null;
        }
    }

    public async Task<Attachment?> CreateAttachment(Attachment attachment)
    {
        try
        {
            if (attachment == null)
                throw new ArgumentNullException(nameof(attachment));

            await _db.Attachments.AddAsync(attachment);
            await _db.SaveChangesAsync();
            return attachment;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-CreateAttachment: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdateAttachment(Attachment attachment)
    {
        try
        {
            if (attachment == null)
                throw new ArgumentNullException(nameof(attachment));

            var existingAttachment = await _db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachment.AttachmentId);
            if (existingAttachment == null) return false;

            existingAttachment.IsComplete = attachment.IsComplete;

            _db.Attachments.Update(existingAttachment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-UpdateAttachment: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteAttachment(Guid attachmentId)
    {
        try
        {
            var attachment = await _db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachmentId);
            if (attachment == null) return false;

            _db.Attachments.Remove(attachment);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-DeleteAttachment: {ex.Message}");
            return false;
        }
    }
}
