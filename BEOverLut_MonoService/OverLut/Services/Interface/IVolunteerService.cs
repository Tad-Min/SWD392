using BusinessObject.OverlutEntiy;
using DTOs.Overlut;

namespace Services.Interface;

public interface IVolunteerService
{
    // Registration & profile management
    Task<VolunteerProfileDTO?> RegisterVolunteerAsync(int userId, string? notes, string? province, string? ward);
    Task<VolunteerProfileDTO?> GetMyProfileAsync(int userId);
    Task<bool> UpdateMyProfileAsync(int userId, bool isAvailable, string? notes, string? province, string? ward);
    Task<VolunteerProfileDTO?> GetProfileByUserIdAsync(int userId);

    // Manager operations
    Task<IEnumerable<VolunteerProfileDTO>> GetApplicationsAsync(int? status);
    Task<VolunteerProfileDTO?> ApproveVolunteerAsync(int targetUserId, int managerId);
    Task<VolunteerProfileDTO?> RejectVolunteerAsync(int targetUserId, int managerId, string? reason);
    Task<VolunteerProfileDTO?> SuspendVolunteerAsync(int targetUserId, int managerId, string? reason);

    // Skills
    Task<IEnumerable<VolunteerSkillDTO>> GetMySkillsAsync(int userId);
    Task<bool> SetSkillsAsync(int userId, IEnumerable<int> skillTypeIds);
    Task<IEnumerable<object>> GetSkillTypesAsync();

    // Offers
    Task<VolunteerOfferDTO?> CreateOfferAsync(int userId, VolunteerOffer offer);
    Task<IEnumerable<VolunteerOfferDTO>> GetMyOffersAsync(int userId);
    Task<IEnumerable<VolunteerOfferDTO>> GetOffersByUserIdAsync(int userId);
    Task<VolunteerOfferDTO?> UpdateOfferAsync(int userId, int offerId, VolunteerOffer updatedOffer);
    Task<bool> DeleteOfferAsync(int userId, int offerId);
    Task<IEnumerable<object>> GetOfferTypesAsync();
    Task<VolunteerOfferDTO?> ReceiveOfferAsync(int offerId, int managerId, int warehouseId, int productId);
    Task<IEnumerable<VolunteerOfferDTO>> GetAllOffersAsync(int? status);
    Task<VolunteerOfferDTO?> ReturnOfferAsync(int offerId, int managerId);
}
