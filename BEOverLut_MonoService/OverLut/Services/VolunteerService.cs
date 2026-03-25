using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Repositories.Interface.Overlut;
using Services.Interface;

namespace Services;

/// <summary>
/// All business rules for the Volunteer lifecycle:
/// - Volunteer = existing User + VolunteerProfile (NOT a new account)
/// - Pending → Approved/Rejected/Suspended
/// - Only after Approved: User.RoleId updated to Volunteer role
/// - Email sent on approve / reject / team assignment
/// </summary>
public class VolunteerService : IVolunteerService
{
    private const int VolunteerRoleId = 6;       // Volunteer role ID in Roles table
    private const int StatusPending = 0;
    private const int StatusApproved = 1;
    private const int StatusRejected = 2;
    private const int StatusSuspended = 3;

    private readonly IVolunteerProfileRepository _profileRepo;
    private readonly IVolunteerSkillRepository _skillRepo;
    private readonly IVolunteerOfferRepository _offerRepo;
    private readonly IUserRepository _userRepo;
    private readonly IEmailService _emailService;
    private readonly IWarehouseRepository _warehouseRepo;
    private readonly IWarehouseStockRepository _warehouseStockRepo;

    public VolunteerService(
        IVolunteerProfileRepository profileRepo,
        IVolunteerSkillRepository skillRepo,
        IVolunteerOfferRepository offerRepo,
        IUserRepository userRepo,
        IEmailService emailService,
        IWarehouseRepository warehouseRepo,
        IWarehouseStockRepository warehouseStockRepo)
    {
        _profileRepo = profileRepo;
        _skillRepo = skillRepo;
        _offerRepo = offerRepo;
        _userRepo = userRepo;
        _emailService = emailService;
        _warehouseRepo = warehouseRepo;
        _warehouseStockRepo = warehouseStockRepo;
    }

    #region Registration & Profile Management

    public async Task<VolunteerProfileDTO?> RegisterVolunteerAsync(int userId, string? notes, string? province, string? ward)
    {
        // Validate: user must exist
        var user = await _userRepo.GetUserById(userId);
        if (user == null)
            throw new InvalidOperationException("User not found.");

        // Validate: no duplicate active profile
        var existing = await _profileRepo.GetByUserId(userId);
        if (existing != null && existing.ApplicationStatus != StatusRejected)
            throw new InvalidOperationException("User already has an active or pending volunteer profile.");

        // CRITICAL: Do NOT create a new user. Link profile to existing user.
        var profile = new VolunteerProfile
        {
            UserId = userId,
            ApplicationStatus = StatusPending,
            IsAvailable = true,
            Notes = notes,
            VolunteerProvince = province,
            VolunteerWard = ward
        };

        var created = await _profileRepo.Create(profile);
        return MappingHandle.EntityToDTO(created);
    }

    public async Task<VolunteerProfileDTO?> GetMyProfileAsync(int userId)
    {
        var profile = await _profileRepo.GetByUserId(userId);
        return MappingHandle.EntityToDTO(profile);
    }

    public async Task<bool> UpdateMyProfileAsync(int userId, bool isAvailable, string? notes, string? province, string? ward)
    {
        var profile = await _profileRepo.GetByUserId(userId);
        if (profile == null) return false;

        profile.IsAvailable = isAvailable;
        if (notes != null) profile.Notes = notes;
        if (province != null) profile.VolunteerProvince = province;
        if (ward != null) profile.VolunteerWard = ward;
        
        return await _profileRepo.Update(profile);
    }

    public async Task<VolunteerProfileDTO?> GetProfileByUserIdAsync(int userId)
    {
        var profile = await _profileRepo.GetByUserId(userId);
        return MappingHandle.EntityToDTO(profile);
    }

    #endregion

    #region Manager Operations

    public async Task<IEnumerable<VolunteerProfileDTO>> GetApplicationsAsync(int? status)
    {
        var profiles = await _profileRepo.GetByStatus(status);
        return profiles.Select(p => MappingHandle.EntityToDTO(p)!).Where(x => x != null);
    }

    public async Task<VolunteerProfileDTO?> ApproveVolunteerAsync(int targetUserId, int managerId)
    {
        var profile = await _profileRepo.GetByUserId(targetUserId);
        if (profile == null)
            throw new InvalidOperationException("Volunteer profile not found.");

        profile.ApplicationStatus = StatusApproved;
        profile.ApprovedByManagerId = managerId;
        profile.ApprovedAt = DateTime.UtcNow;
        profile.RejectedReason = null;
        await _profileRepo.Update(profile);

        // Grant Volunteer role to the SAME existing User account
        var user = await _userRepo.GetUserById(targetUserId);
        if (user != null && user.RoleId != VolunteerRoleId)
        {
            user.RoleId = VolunteerRoleId;
            await _userRepo.UpdateUser(user);
        }

        // Send approve notification
        try
        {
            await _emailService.SendVolunteerApprovedAsync(
                profile.User?.Email ?? user?.Email ?? "",
                profile.User?.FullName ?? user?.FullName ?? "Tình nguyện viên");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[VolunteerService][ApproveEmail] Warning: {ex.Message}");
        }

        return MappingHandle.EntityToDTO(await _profileRepo.GetByUserId(targetUserId));
    }

    public async Task<VolunteerProfileDTO?> RejectVolunteerAsync(int targetUserId, int managerId, string? reason)
    {
        var profile = await _profileRepo.GetByUserId(targetUserId);
        if (profile == null)
            throw new InvalidOperationException("Volunteer profile not found.");

        profile.ApplicationStatus = StatusRejected;
        profile.ApprovedByManagerId = managerId;
        profile.RejectedReason = reason;
        await _profileRepo.Update(profile);

        // Send reject notification
        try
        {
            await _emailService.SendVolunteerRejectedAsync(
                profile.User?.Email ?? "",
                profile.User?.FullName ?? "Tình nguyện viên",
                reason);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[VolunteerService][RejectEmail] Warning: {ex.Message}");
        }

        return MappingHandle.EntityToDTO(await _profileRepo.GetByUserId(targetUserId));
    }

    public async Task<VolunteerProfileDTO?> SuspendVolunteerAsync(int targetUserId, int managerId, string? reason)
    {
        var profile = await _profileRepo.GetByUserId(targetUserId);
        if (profile == null)
            throw new InvalidOperationException("Volunteer profile not found.");

        profile.ApplicationStatus = StatusSuspended;
        profile.RejectedReason = reason;
        await _profileRepo.Update(profile);

        return MappingHandle.EntityToDTO(await _profileRepo.GetByUserId(targetUserId));
    }

    #endregion

    #region Skills

    public async Task<IEnumerable<VolunteerSkillDTO>> GetMySkillsAsync(int userId)
    {
        var skills = await _skillRepo.GetByUserId(userId);
        return skills.Select(s => MappingHandle.EntityToDTO(s)!).Where(x => x != null);
    }

    public async Task<bool> SetSkillsAsync(int userId, IEnumerable<int> skillTypeIds)
    {
        // Validate: user must be an approved volunteer
        var profile = await _profileRepo.GetByUserId(userId);
        if (profile == null || profile.ApplicationStatus != StatusApproved)
            throw new InvalidOperationException("Only approved volunteers can set skills.");

        return await _skillRepo.SetSkills(userId, skillTypeIds);
    }

    public async Task<IEnumerable<object>> GetSkillTypesAsync()
    {
        var types = await _skillRepo.GetAllSkillTypes();
        return types.Select(t => (object)new { t.SkillTypeId, t.SkillName });
    }

    #endregion

    #region Offers

    public async Task<VolunteerOfferDTO?> CreateOfferAsync(int userId, VolunteerOffer offer)
    {
        // Business rule: returnable offers must have an offer name
        if (offer.IsReturnRequired && string.IsNullOrWhiteSpace(offer.OfferName))
            throw new InvalidOperationException("Returnable offers must have an OfferName for asset tracking.");

        offer.UserId = userId;
        var created = await _offerRepo.Create(offer);
        return MappingHandle.EntityToDTO(created);
    }

    public async Task<IEnumerable<VolunteerOfferDTO>> GetMyOffersAsync(int userId)
    {
        var offers = await _offerRepo.GetByUserId(userId);
        return offers.Select(o => MappingHandle.EntityToDTO(o)!).Where(x => x != null);
    }

    public async Task<IEnumerable<VolunteerOfferDTO>> GetOffersByUserIdAsync(int userId)
    {
        var offers = await _offerRepo.GetByUserId(userId);
        return offers.Select(o => MappingHandle.EntityToDTO(o)!).Where(x => x != null);
    }

    public async Task<VolunteerOfferDTO?> UpdateOfferAsync(int userId, int offerId, VolunteerOffer updatedOffer)
    {
        var existing = await _offerRepo.GetById(offerId);
        if (existing == null) return null;

        // Must be the owner
        if (existing.UserId != userId)
            throw new UnauthorizedAccessException("Cannot modify another user's offer.");

        // Maintain business rule
        if (updatedOffer.IsReturnRequired && string.IsNullOrWhiteSpace(updatedOffer.OfferName))
            throw new InvalidOperationException("Returnable offers must have an OfferName.");

        existing.OfferTypeId = updatedOffer.OfferTypeId;
        existing.OfferName = updatedOffer.OfferName;
        existing.Quantity = updatedOffer.Quantity;
        existing.Unit = updatedOffer.Unit;
        existing.Description = updatedOffer.Description;
        existing.IsReturnRequired = updatedOffer.IsReturnRequired;
        existing.AssetCode = updatedOffer.AssetCode;
        existing.DropoffLocationText = updatedOffer.DropoffLocationText;
        existing.DropoffLatitude = updatedOffer.DropoffLatitude;
        existing.DropoffLongitude = updatedOffer.DropoffLongitude;
        existing.ContactPhone = updatedOffer.ContactPhone;
        existing.AvailableFrom = updatedOffer.AvailableFrom;
        existing.AvailableTo = updatedOffer.AvailableTo;

        await _offerRepo.Update(existing);
        return MappingHandle.EntityToDTO(await _offerRepo.GetById(offerId));
    }

    public async Task<bool> DeleteOfferAsync(int userId, int offerId)
    {
        var existing = await _offerRepo.GetById(offerId);
        if (existing == null) return false;

        if (existing.UserId != userId)
            throw new UnauthorizedAccessException("Cannot delete another user's offer.");

        return await _offerRepo.Delete(offerId);
    }

    public async Task<IEnumerable<object>> GetOfferTypesAsync()
    {
        var types = await _offerRepo.GetAllOfferTypes();
        return types.Select(t => (object)new { t.OfferTypeId, t.TypeName, t.IsTypicallyReturnable });
    }

    public async Task<VolunteerOfferDTO?> ReceiveOfferAsync(int offerId, int managerId, int warehouseId, int productId)
    {
        // 1. Lấy thông tin Offer
        var offer = await _offerRepo.GetById(offerId);
        if (offer == null)
            throw new InvalidOperationException("Offer không tồn tại.");
        if (offer.CurrentStatus != 0)
            throw new InvalidOperationException("Offer này đã được xử lý hoặc không còn ở trạng thái sẵn sàng.");

        // 2. Lấy thông tin Warehouse
        var warehouse = await _warehouseRepo.GetWarehouseById(warehouseId);
        if (warehouse == null)
            throw new InvalidOperationException($"Kho với ID {warehouseId} không tồn tại.");
        if (!warehouse.IsActive)
            throw new InvalidOperationException($"Kho '{warehouse.WarehouseName}' đang không hoạt động.");

        // 3. Đổi CurrentStatus của Offer -> 1 (Assigned/Received)
        offer.CurrentStatus = 1;
        await _offerRepo.Update(offer);

        // 4. Cập nhật WarehouseStock (AddOrUpdate)
        var stocks = await _warehouseStockRepo.GetAllWarehouseStocks(warehouseId, productId);
        var existing = stocks?.FirstOrDefault();
        if (existing != null)
        {
            existing.CurrentQuantity += offer.Quantity;
            existing.LastUpdated = DateTime.UtcNow;
            await _warehouseStockRepo.UpdateWarehouseStock(existing);
        }
        else
        {
            await _warehouseStockRepo.AddWarehouseStock(new WarehouseStock
            {
                WarehouseId = warehouseId,
                ProductId = productId,
                CurrentQuantity = offer.Quantity,
                LastUpdated = DateTime.UtcNow
            });
        }

        // 5. Gửi email cho Volunteer
        try
        {
            var user = offer.User ?? await _userRepo.GetUserById(offer.UserId);
            var offerLabel = offer.OfferName ?? offer.OfferType?.TypeName ?? "Vật phẩm đóng góp";
            await _emailService.SendOfferConfirmedAsync(
                user?.Email ?? "",
                user?.FullName ?? "Tình nguyện viên",
                offerLabel,
                warehouse.WarehouseName,
                warehouse.Address ?? "(Chưa có địa chỉ)",
                offer.Quantity,
                offer.Unit ?? "đơn vị");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[VolunteerService][ReceiveOfferEmail] Warning: {ex.Message}");
        }

        return MappingHandle.EntityToDTO(await _offerRepo.GetById(offerId));
    }

    public async Task<IEnumerable<VolunteerOfferDTO>> GetAllOffersAsync(int? status)
    {
        var offers = await _offerRepo.GetAll(status);
        return offers.Select(o => MappingHandle.EntityToDTO(o)!).Where(x => x != null);
    }

    public async Task<VolunteerOfferDTO?> ReturnOfferAsync(int offerId, int managerId)
    {
        var offer = await _offerRepo.GetById(offerId);
        if (offer == null)
            throw new InvalidOperationException("Offer không tồn tại.");

        if (offer.CurrentStatus != 1)
            throw new InvalidOperationException("Chỉ có thể hoàn trả những vật phẩm đang ở trạng thái đã tiếp nhận.");

        offer.CurrentStatus = 2; // Returned
        offer.UpdatedAt = DateTime.UtcNow;
        await _offerRepo.Update(offer);

        // Send email to volunteer
        try
        {
            var user = offer.User ?? await _userRepo.GetUserById(offer.UserId);
            var offerLabel = offer.OfferName ?? offer.OfferType?.TypeName ?? "Vật phẩm đóng góp";
            await _emailService.SendOfferReturnedAsync(
                user?.Email ?? "",
                user?.FullName ?? "Tình nguyện viên",
                offerLabel,
                offer.Quantity,
                offer.Unit ?? "đơn vị");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[VolunteerService][ReturnOfferEmail] Warning: {ex.Message}");
        }

        return MappingHandle.EntityToDTO(await _offerRepo.GetById(offerId));
    }

    #endregion
}
