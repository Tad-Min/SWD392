using System.Security.Claims;
using BusinessObject.OverlutEntiy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using WebApi.Models.VolunteerModel;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VolunteerController : ControllerBase
{
    private readonly IVolunteerService _volunteerService;

    public VolunteerController(IVolunteerService volunteerService)
    {
        _volunteerService = volunteerService;
    }

    private int GetCurrentUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Returns true if the current user has roleId 5 (Admin) or 4 (Manager).</summary>
    private bool IsManagerOrAdmin()
    {
        var roleIdClaim = User.FindFirstValue(ClaimTypes.Role);
        
        // As a fallback, try checking the short name "role" in case mapping is still happening
        if (roleIdClaim == null)
            roleIdClaim = User.FindFirstValue("role");

        return roleIdClaim == "5" || roleIdClaim == "4";
    }

    [HttpGet("my-claims")]
    [AllowAnonymous]
    public IActionResult GetMyClaims()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        return Ok(claims);
    }

    // ─── Volunteer Registration & Profile ────────────────────────────────────

    /// <summary>POST /api/Volunteer/register – Any authenticated user can register as a volunteer.</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterVolunteerModel model)
    {
        try
        {
            var userId = GetCurrentUserId();
            var dto = await _volunteerService.RegisterVolunteerAsync(userId, model.Notes);
            return Ok(new { message = "Đăng ký tình nguyện viên thành công. Vui lòng chờ Manager phê duyệt.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>GET /api/Volunteer/me</summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        try
        {
            var userId = GetCurrentUserId();
            var dto = await _volunteerService.GetMyProfileAsync(userId);
            if (dto == null) return NotFound(new { message = "Volunteer profile not found." });
            return Ok(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>PUT /api/Volunteer/me</summary>
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateVolunteerModel model)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _volunteerService.UpdateMyProfileAsync(userId, model.IsAvailable, model.Notes);
            if (!result) return NotFound(new { message = "Volunteer profile not found." });
            return Ok(new { message = "Cập nhật hồ sơ tình nguyện viên thành công." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    // ─── Manager Operations ───────────────────────────────────────────────────

    /// <summary>GET /api/Volunteer/applications?status=0 – Manager only.</summary>
    [HttpGet("applications")]
    public async Task<IActionResult> GetApplications([FromQuery] int? status)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var applications = await _volunteerService.GetApplicationsAsync(status);
            return Ok(applications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>GET /api/Volunteer/{userId} – Get profile of specific user. Manager/Admin.</summary>
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetVolunteerByUserId(int userId)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var dto = await _volunteerService.GetProfileByUserIdAsync(userId);
            if (dto == null) return NotFound(new { message = $"No volunteer profile found for user {userId}." });
            return Ok(dto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>PUT /api/Volunteer/{userId}/approve – Manager/Admin approves volunteer application.</summary>
    [HttpPut("{userId}/approve")]
    public async Task<IActionResult> ApproveVolunteer(int userId)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var managerId = GetCurrentUserId();
            var dto = await _volunteerService.ApproveVolunteerAsync(userId, managerId);
            return Ok(new { message = "Phê duyệt tình nguyện viên thành công.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>PUT /api/Volunteer/{userId}/reject – Manager/Admin rejects volunteer application.</summary>
    [HttpPut("{userId}/reject")]
    public async Task<IActionResult> RejectVolunteer(int userId, [FromBody] RejectVolunteerModel model)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var managerId = GetCurrentUserId();
            var dto = await _volunteerService.RejectVolunteerAsync(userId, managerId, model.Reason);
            return Ok(new { message = "Đã từ chối đơn đăng ký tình nguyện viên.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>PUT /api/Volunteer/{userId}/suspend – Manager/Admin suspends a volunteer.</summary>
    [HttpPut("{userId}/suspend")]
    public async Task<IActionResult> SuspendVolunteer(int userId, [FromBody] SuspendVolunteerModel model)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var managerId = GetCurrentUserId();
            var dto = await _volunteerService.SuspendVolunteerAsync(userId, managerId, model.Reason);
            return Ok(new { message = "Đã đình chỉ tình nguyện viên.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    // ─── Skills ───────────────────────────────────────────────────────────────

    /// <summary>GET /api/Volunteer/skill-types – All available skill types.</summary>
    [HttpGet("skill-types")]
    public async Task<IActionResult> GetSkillTypes()
    {
        var types = await _volunteerService.GetSkillTypesAsync();
        return Ok(types);
    }

    /// <summary>GET /api/Volunteer/skills – My current skills.</summary>
    [HttpGet("skills")]
    public async Task<IActionResult> GetMySkills()
    {
        var userId = GetCurrentUserId();
        var skills = await _volunteerService.GetMySkillsAsync(userId);
        return Ok(skills);
    }

    /// <summary>POST /api/Volunteer/skills – Set skills (replaces all). Approved volunteer only.</summary>
    [HttpPost("skills")]
    public async Task<IActionResult> SetSkills([FromBody] SetSkillsModel model)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _volunteerService.SetSkillsAsync(userId, model.SkillTypeIds);
            return Ok(new { message = "Cập nhật kỹ năng thành công.", success = result });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    // ─── Offers ───────────────────────────────────────────────────────────────

    /// <summary>GET /api/Volunteer/offer-types – All available offer types.</summary>
    [HttpGet("offer-types")]
    public async Task<IActionResult> GetOfferTypes()
    {
        var types = await _volunteerService.GetOfferTypesAsync();
        return Ok(types);
    }

    /// <summary>POST /api/Volunteer/offers – Create a new offer.</summary>
    [HttpPost("offers")]
    public async Task<IActionResult> CreateOffer([FromBody] CreateOfferModel model)
    {
        try
        {
            var userId = GetCurrentUserId();
            var offer = new VolunteerOffer
            {
                OfferTypeId = model.OfferTypeId,
                OfferName = model.OfferName,
                Quantity = model.Quantity,
                Unit = model.Unit,
                Description = model.Description,
                IsReturnRequired = model.IsReturnRequired,
                AssetCode = model.AssetCode,
                DropoffLocationText = model.DropoffLocationText,
                DropoffLatitude = model.DropoffLatitude,
                DropoffLongitude = model.DropoffLongitude,
                ContactPhone = model.ContactPhone,
                AvailableFrom = model.AvailableFrom,
                AvailableTo = model.AvailableTo
            };
            var dto = await _volunteerService.CreateOfferAsync(userId, offer);
            return Ok(new { message = "Tạo offer thành công.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>GET /api/Volunteer/offers/me – My offers.</summary>
    [HttpGet("offers/me")]
    public async Task<IActionResult> GetMyOffers()
    {
        var userId = GetCurrentUserId();
        var offers = await _volunteerService.GetMyOffersAsync(userId);
        return Ok(offers);
    }

    /// <summary>GET /api/Volunteer/offers/{userId} – Offers of a specific user. Manager/Admin.</summary>
    [HttpGet("offers/{userId}")]
    public async Task<IActionResult> GetOffersByUserId(int userId)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        var offers = await _volunteerService.GetOffersByUserIdAsync(userId);
        return Ok(offers);
    }

    /// <summary>PUT /api/Volunteer/offers/{offerId} – Update own offer.</summary>
    [HttpPut("offers/{offerId}")]
    public async Task<IActionResult> UpdateOffer(int offerId, [FromBody] UpdateOfferModel model)
    {
        try
        {
            var userId = GetCurrentUserId();
            var updated = new VolunteerOffer
            {
                OfferTypeId = model.OfferTypeId,
                OfferName = model.OfferName,
                Quantity = model.Quantity,
                Unit = model.Unit,
                Description = model.Description,
                IsReturnRequired = model.IsReturnRequired,
                AssetCode = model.AssetCode,
                DropoffLocationText = model.DropoffLocationText,
                DropoffLatitude = model.DropoffLatitude,
                DropoffLongitude = model.DropoffLongitude,
                ContactPhone = model.ContactPhone,
                AvailableFrom = model.AvailableFrom,
                AvailableTo = model.AvailableTo
            };
            var dto = await _volunteerService.UpdateOfferAsync(userId, offerId, updated);
            if (dto == null) return NotFound(new { message = "Offer not found." });
            return Ok(new { message = "Cập nhật offer thành công.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>DELETE /api/Volunteer/offers/{offerId} – Delete own offer.</summary>
    [HttpDelete("offers/{offerId}")]
    public async Task<IActionResult> DeleteOffer(int offerId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _volunteerService.DeleteOfferAsync(userId, offerId);
            if (!result) return NotFound(new { message = "Offer not found." });
            return Ok(new { message = "Xóa offer thành công." });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }

    /// <summary>PUT /api/Volunteer/offers/{offerId}/receive – Manager confirms and receives an offer into a warehouse.</summary>
    [HttpPut("offers/{offerId}/receive")]
    public async Task<IActionResult> ReceiveOffer(int offerId, [FromBody] ReceiveOfferModel model)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        try
        {
            var managerId = GetCurrentUserId();
            var dto = await _volunteerService.ReceiveOfferAsync(offerId, managerId, model.WarehouseId, model.ProductId);
            return Ok(new { message = "Xác nhận tiếp nhận vật phẩm thành công. Email đã được gửi đến tình nguyện viên.", data = dto });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Server error", error = ex.Message });
        }
    }
}
