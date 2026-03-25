using BusinessObject.OverlutEntiy;
using DAOs;
using DAOs.Overlut;
using Repositories.Interface.Overlut;

namespace Repositories.Overlut;

public class VolunteerOfferRepository : IVolunteerOfferRepository
{
    private readonly VolunteerOfferDAO _dao;

    public VolunteerOfferRepository(OverlutDbContext db)
    {
        _dao = new VolunteerOfferDAO(db);
    }

    public async Task<IEnumerable<VolunteerOffer>> GetByUserId(int userId) => await _dao.GetByUserId(userId);
    public async Task<VolunteerOffer?> GetById(int offerId) => await _dao.GetById(offerId);
    public async Task<VolunteerOffer?> Create(VolunteerOffer offer) => await _dao.Create(offer);
    public async Task<bool> Update(VolunteerOffer offer) => await _dao.Update(offer);
    public async Task<bool> Delete(int offerId) => await _dao.Delete(offerId);
    public async Task<IEnumerable<VolunteerOfferType>> GetAllOfferTypes() => await _dao.GetAllOfferTypes();
    public async Task<IEnumerable<VolunteerOffer>> GetAll(int? status) => await _dao.GetAll(status);
}
