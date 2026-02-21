using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
namespace DAOs.Overlut;

public class RescueRequestDAO
{
    public static async Task<RescueRequest?> AddRescueRequest(RescueRequest? rescueRequest)
    {
        try
        {
            if (rescueRequest == null)
                throw new ArgumentNullException(nameof(rescueRequest));

            using var db = new OverlutDbContext();
            rescueRequest.CreatedAt = DateTime.UtcNow;
            await db.RescueRequests.AddAsync(rescueRequest);
            await db.SaveChangesAsync();
            return rescueRequest;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-AddRescueRequest: {ex.Message}");
            return null;
        }
    }

    public static async Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(
        int? rescueRequestId,
        int? userReqId,
        int? requestType,
        int? urgencyLevel,
        int? status,
        string? description)
    {
        try
        {
            using var db = new OverlutDbContext();
            var query = db.RescueRequests.AsQueryable();

            if (rescueRequestId.HasValue)
                query = query.Where(x => x.RescueRequestId == rescueRequestId.Value);

            if (userReqId.HasValue)
                query = query.Where(x => x.UserReqId == userReqId.Value);

            if (requestType.HasValue)
                query = query.Where(x => x.RequestType == requestType.Value);

            if (urgencyLevel.HasValue)
                query = query.Where(x => x.UrgencyLevel == urgencyLevel.Value);

            if (status.HasValue)
                query = query.Where(x => x.Status == status.Value);

            if (!string.IsNullOrEmpty(description))
                query = query.Where(x => x.Description != null && x.Description.Contains(description));

            return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-GetAllRescueRequests: {ex.Message}");
            return null;
        }
    }

    public static async Task<bool> UpdateRescueRequest(RescueRequest rescueRequest)
    {
        try
        {
            if (rescueRequest == null)
                throw new ArgumentNullException(nameof(rescueRequest));

            using var db = new OverlutDbContext();
            var existingRequest = await db.RescueRequests.FirstOrDefaultAsync(
                x => x.RescueRequestId == rescueRequest.RescueRequestId);

            if (existingRequest == null) return false;

            existingRequest.UserReqId = rescueRequest.UserReqId;
            existingRequest.RequestType = rescueRequest.RequestType;
            existingRequest.UrgencyLevel = rescueRequest.UrgencyLevel;
            existingRequest.Ipaddress = rescueRequest.Ipaddress;
            existingRequest.UserAgent = rescueRequest.UserAgent;
            existingRequest.Status = rescueRequest.Status;
            existingRequest.Description = rescueRequest.Description;
            existingRequest.PeopleCount = rescueRequest.PeopleCount;
            existingRequest.Location = rescueRequest.Location;
            existingRequest.LocationText = rescueRequest.LocationText;

            db.RescueRequests.Update(existingRequest);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-UpdateRescueRequest: {ex.Message}");
            return false;
        }
    }

    public static async Task<bool> DeleteRescueRequestById(int rescueRequestId)
    {
        try
        {
            using var db = new OverlutDbContext();
            var rescueRequest = await db.RescueRequests.FirstOrDefaultAsync(
                x => x.RescueRequestId == rescueRequestId);

            if (rescueRequest == null) return false;

            db.RescueRequests.Remove(rescueRequest);
            await db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-DeleteRescueRequestById: {ex.Message}");
            return false;
        }
    }
}
