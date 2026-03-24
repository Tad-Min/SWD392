using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using WebApi.Models.AssignmentModel;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VolunteerAssignmentController : ControllerBase
{
    private readonly IRescueTeamService _rescueTeamService;

    public VolunteerAssignmentController(IRescueTeamService rescueTeamService)
    {
        _rescueTeamService = rescueTeamService;
    }

    private int GetCurrentUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsManagerOrAdmin()
    {
        var roleIdClaim = User.FindFirstValue(ClaimTypes.Role);
        return roleIdClaim == "5" || roleIdClaim == "4";
    }

    /// <summary>
    /// POST /api/VolunteerAssignment/assign-team
    /// Assigns an approved volunteer to a rescue team.
    /// Validates volunteer approval status, creates membership, sends email notification.
    /// </summary>
    [HttpPost("assign-team")]
    public async Task<IActionResult> AssignToTeam([FromBody] AssignVolunteerToTeamModel model)
    {
        if (!IsManagerOrAdmin()) return Forbid();
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var managerId = GetCurrentUserId();
            var member = await _rescueTeamService.AssignVolunteerToTeamAsync(
                targetUserId: model.UserId,
                teamId: model.TeamId,
                roleId: model.RoleId,
                assignedByManagerId: managerId,
                notifyByEmail: model.NotifyByEmail,
                note: model.Note
            );

            if (member == null)
                return BadRequest(new { message = "Không thể gán tình nguyện viên vào đội." });

            return Ok(new
            {
                message = "Gán tình nguyện viên vào đội thành công.",
                data = member,
                emailSent = model.NotifyByEmail
            });
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
