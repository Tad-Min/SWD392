using BusinessObject.OverlutStorageEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.OverlutStorage;

public class AttachmentDAO
{
    public static async Task<IEnumerable<Attachment>> GetAllAttachments()
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            return await db.Attachments.ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-GetAllAttachments: {ex.Message}");
            return new List<Attachment>();
        }
    }

    public static async Task<Attachment?> GetAttachmentById(Guid attachmentId)
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            return await db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachmentId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-GetAttachmentById: {ex.Message}");
            return null;
        }
    }

    public static async Task<Attachment?> CreateAttachment(Attachment attachment)
    {
        try
        {
            if (attachment == null)
                throw new ArgumentNullException(nameof(attachment));

            using var db = new OverlutDbStorageContext();
            await db.Attachments.AddAsync(attachment);
            await db.SaveChangesAsync();
            return attachment;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-CreateAttachment: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateAttachment(Attachment attachment)
    {
        try
        {
            if (attachment == null)
                throw new ArgumentNullException(nameof(attachment));

            using var db = new OverlutDbStorageContext();
            var existingAttachment = await db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachment.AttachmentId);
            if (existingAttachment == null) return false;

            existingAttachment.IsComplete = attachment.IsComplete;

            db.Attachments.Update(existingAttachment);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-UpdateAttachment: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteAttachment(Guid attachmentId)
    {
        try
        {
            using var db = new OverlutDbStorageContext();
            var attachment = await db.Attachments.FirstOrDefaultAsync(x => x.AttachmentId == attachmentId);
            if (attachment == null) return false;

            db.Attachments.Remove(attachment);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentDAO-DeleteAttachment: {ex.Message}");
            return false;
        }
    }
}
