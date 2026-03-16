using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class AttachmentRescueDAO
{
    private readonly OverlutDbContext _db;

    public AttachmentRescueDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<IEnumerable<AttachmentRescue>?> GetAllAttachmentRescueWithRescueRequestId(int rescueRequestId)
    {
        try
        {
            return await _db.AttachmentRescues.Where(x => x.RescueRequestId == rescueRequestId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentRescueDAO-GetAllAttachmentRescueWithRescueRequestId: {ex.Message}");
            return null;
        }
    }
    public async Task<IEnumerable<AttachmentRescue>?> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId)
    {
        try
        {
            return await _db.AttachmentRescues.Where(x => x.AttachmentId == attachmentId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentRescueDAO-GetAllAttachmentMissionsWithAttachmentId: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId)
    {
        try
        {
            var deleted = await _db.AttachmentRescues.Where(x => x.AttachmentId == attachmentId).ExecuteDeleteAsync();
            return deleted > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentRescueDAO-DeleteAttachmentMissionsById: {ex.Message}");
            return false;
        }
    }

    public async Task<AttachmentRescue?> AddAttachmentMissionsByMissionId(Guid attachmentId, int rescueRequestId, long fileSize, String fileType)
    {
        try
        {
            var att = new AttachmentRescue
            {
                AttachmentId = attachmentId,
                RescueRequestId = rescueRequestId,
                FileSize = fileSize,
                FileType = fileType,
            };
            await _db.AttachmentRescues.AddAsync(att);
            await _db.SaveChangesAsync();
            return att;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentRescueDAO-DeleteAttachmentMissionsById: {ex.Message}");
            return null;
        }
    }
}
