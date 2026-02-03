using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class AttachmentRescueDAO
{
    public static async Task<IEnumerable<AttachmentRescue>> GetAllAttachmentRescueWithRescueRequestId(int rescueRequestId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentRescues.Where(x => x.RescueRequestId == rescueRequestId).ToListAsync();
    }
    public static async Task<IEnumerable<AttachmentRescue>> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentRescues.Where(x => x.AttachmentId == attachmentId).ToListAsync();
    }

    public static async Task<Boolean> DeleteAttachmentMissionsById(Guid attachmentId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentRescues.Where(x => x.AttachmentId == attachmentId).ExecuteDeleteAsync() > 0;
    }

    public static async Task<AttachmentRescue> AddAttachmentMissionsByMissionId(Guid attachmentId, int rescueRequestId, long fileSize, String fileType)
    {
        using var db = new OverlutDbContext();
        var att = new AttachmentRescue
        {
            AttachmentId = attachmentId,
            RescueRequestId = rescueRequestId,
            FileSize = fileSize,
            FileType = fileType,
        };
        await db.AttachmentRescues.AddAsync(att);
        await db.SaveChangesAsync();
        return att;
    }
}
