using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
namespace DAOs.Overlut;

public class RescueRequestDAO
{
    private readonly OverlutDbContext _db;

    public RescueRequestDAO(OverlutDbContext db)
    {
        _db = db;
    }
    public async Task<RescueRequest?> AddRescueRequest(RescueRequest? rescueRequest)
    {
        try
        {
            if (rescueRequest == null)
                throw new ArgumentNullException(nameof(rescueRequest));

            
            await _db.RescueRequests.AddAsync(rescueRequest);
            await _db.SaveChangesAsync();
            return rescueRequest;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-AddRescueRequest: {ex.Message}");
            return null;
        }
    }

    public async Task<RescueRequest?> GetRescueRequestByIdAsync(int id)
    {
        try
        {
            
            return await _db.RescueRequests.FirstOrDefaultAsync(e => e.RescueRequestId == id);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-GetRescueRequestByIdAsync: {ex.Message}");
            return null;
        }


    }
    public async Task<IEnumerable<RescueRequest>?> GetAllRescueRequests(
        int? rescueRequestId,
        int? userReqId,
        int? requestType,
        int? urgencyLevel,
        int? status,
        string? description)
    {
        try
        {
            
            var query = _db.RescueRequests.AsQueryable();

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

    public async Task<bool> UpdateRescueRequest(RescueRequest rescueRequest)
    {
        try
        {
            if (rescueRequest == null)
                throw new ArgumentNullException(nameof(rescueRequest));

            
            var existingRequest = await _db.RescueRequests.FirstOrDefaultAsync(
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
            _db.RescueRequests.Update(existingRequest);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-UpdateRescueRequest: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteRescueRequestById(int rescueRequestId)
    {
        try
        {
            
            var rescueRequest = await _db.RescueRequests.FirstOrDefaultAsync(
                x => x.RescueRequestId == rescueRequestId);

            if (rescueRequest == null) return false;

            _db.RescueRequests.Remove(rescueRequest);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RescueRequestDAO-DeleteRescueRequestById: {ex.Message}");
            return false;
        }
    }
}
