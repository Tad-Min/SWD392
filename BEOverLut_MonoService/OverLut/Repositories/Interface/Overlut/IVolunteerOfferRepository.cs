using BusinessObject.OverlutEntiy;

namespace Repositories.Interface.Overlut;

public interface IVolunteerOfferRepository
{
    Task<IEnumerable<VolunteerOffer>> GetByUserId(int userId);
    Task<VolunteerOffer?> GetById(int offerId);
    Task<VolunteerOffer?> Create(VolunteerOffer offer);
    Task<bool> Update(VolunteerOffer offer);
    Task<bool> Delete(int offerId);
    Task<IEnumerable<VolunteerOfferType>> GetAllOfferTypes();
    Task<IEnumerable<VolunteerOffer>> GetAll(int? status);
}
