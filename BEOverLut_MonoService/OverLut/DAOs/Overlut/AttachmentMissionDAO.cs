using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class AttachmentMissionDAO
{
    private readonly OverlutDbContext _db;

    public AttachmentMissionDAO(OverlutDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithMissionId(int missionId)
    {
        try
        {
            return await _db.AttachmentMissions.Where(x => x.MissionId == missionId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentMissionDAO-GetAllAttachmentMissionsWithMissionId: {ex.Message}");
            return null;
        }
    }
    public async Task<IEnumerable<AttachmentMission>?> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId)
    {
        try
        {
            return await _db.AttachmentMissions.Where(x => x.AttachmentId == attachmentId).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentMissionDAO-GetAllAttachmentMissionsWithAttachmentId: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> DeleteAttachmentMissionsById(Guid attachmentId)
    {
        try
        {
            return await _db.AttachmentMissions.Where(x => x.AttachmentId == attachmentId).ExecuteDeleteAsync() > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentMissionDAO-DeleteAttachmentMissionsById: {ex.Message}");
            return false;
        }
    }

    public async Task<AttachmentMission?> AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType)
    {
        try
        {
            var att = new AttachmentMission
            {
                AttachmentId = attachmentId,
                MissionId = missionId,
                FileSize = fileSize,
                FileType = fileType,
            };
            await _db.AttachmentMissions.AddAsync(att);
            await _db.SaveChangesAsync();
            return att;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AttachmentMissionDAO-AddAttachmentMissionsByMissionId: {ex.Message}");
            return null;
        }
    }
}