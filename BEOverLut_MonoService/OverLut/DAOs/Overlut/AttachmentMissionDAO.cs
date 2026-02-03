using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class AttachmentMissionDAO
{
    public static async Task<IEnumerable<AttachmentMission>> GetAllAttachmentMissionsWithMissionId(int missionId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentMissions.Where(x => x.MissionId == missionId).ToListAsync();
    }
    public static async Task<IEnumerable<AttachmentMission>> GetAllAttachmentMissionsWithAttachmentId(Guid attachmentId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentMissions.Where(x => x.AttachmentId == attachmentId).ToListAsync();
    }

    public static async Task<Boolean> DeleteAttachmentMissionsById(Guid attachmentId)
    {
        using var db = new OverlutDbContext();

        return await db.AttachmentMissions.Where(x => x.AttachmentId == attachmentId).ExecuteDeleteAsync() > 0;
    }

    public static async Task<AttachmentMission> AddAttachmentMissionsByMissionId(Guid attachmentId, int missionId, long fileSize, String fileType)
    {
        using var db = new OverlutDbContext();
        var att = new AttachmentMission
        {
            AttachmentId = attachmentId,
            MissionId = missionId,
            FileSize = fileSize,
            FileType = fileType,
        };
        await db.AttachmentMissions.AddAsync(att);
        await db.SaveChangesAsync();
        return att;
    }
}
