using BusinessObject.OverlutEntiy;
using Microsoft.EntityFrameworkCore;

namespace DAOs.Overlut;

public class VolunteerOfferDAO
{
    private readonly OverlutDbContext _db;

    public VolunteerOfferDAO(OverlutDbContext db) => _db = db;

    public async Task<IEnumerable<VolunteerOffer>> GetByUserId(int userId)
    {
        try
        {
            return await _db.VolunteerOffers
                .Include(x => x.OfferType)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-GetByUserId: {ex.Message}");
            return new List<VolunteerOffer>();
        }
    }

    public async Task<VolunteerOffer?> GetById(int offerId)
    {
        try
        {
            return await _db.VolunteerOffers
                .Include(x => x.OfferType)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.OfferId == offerId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-GetById: {ex.Message}");
            return null;
        }
    }

    public async Task<VolunteerOffer?> Create(VolunteerOffer offer)
    {
        try
        {
            offer.CreatedAt = DateTime.UtcNow;
            offer.UpdatedAt = DateTime.UtcNow;
            offer.CurrentStatus = 0; // Available
            await _db.VolunteerOffers.AddAsync(offer);
            await _db.SaveChangesAsync();
            return await GetById(offer.OfferId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-Create: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> Update(VolunteerOffer offer)
    {
        try
        {
            offer.UpdatedAt = DateTime.UtcNow;
            _db.VolunteerOffers.Update(offer);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-Update: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> Delete(int offerId)
    {
        try
        {
            var offer = await _db.VolunteerOffers.FindAsync(offerId);
            if (offer == null) return false;
            _db.VolunteerOffers.Remove(offer);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-Delete: {ex.Message}");
            return false;
        }
    }

    public async Task<IEnumerable<VolunteerOfferType>> GetAllOfferTypes()
    {
        try
        {
            return await _db.VolunteerOfferTypes.OrderBy(x => x.TypeName).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-GetAllOfferTypes: {ex.Message}");
            return new List<VolunteerOfferType>();
        }
    }

    public async Task<IEnumerable<VolunteerOffer>> GetAll(int? status)
    {
        try
        {
            var query = _db.VolunteerOffers
                .Include(x => x.OfferType)
                .Include(x => x.User)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(x => x.CurrentStatus == status.Value);

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"VolunteerOfferDAO-GetAll: {ex.Message}");
            return new List<VolunteerOffer>();
        }
    }
}
