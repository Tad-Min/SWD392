using System.Linq;
using System.Threading.Tasks;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using WebApi.Models.RescueTeamModel;
using NetTopologySuite.Geometries;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RescueTeamController : ControllerBase
    {
        private readonly IRescueTeamService _rescueTeamService;
        private readonly IWebSocketNotificationService _webSocketService;
        private readonly IEmailService _emailService;

        public RescueTeamController(
            IRescueTeamService rescueTeamService,
            IWebSocketNotificationService webSocketService,
            IEmailService emailService)
        {
            _rescueTeamService = rescueTeamService;
            _webSocketService = webSocketService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRescueTeams(
            [FromQuery] int? teamId,
            [FromQuery] string? teamName,
            [FromQuery] int? statusId)
        {
            try
            {
                var teams = await _rescueTeamService.GetAllRescueTeamsAsync(teamId, teamName, statusId);
                
                return Ok(teams);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue teams", error = ex.Message });
            }
        }

        [HttpGet("Roles")]
        public async Task<IActionResult> GetAllRescueTeamRoles()
        {
            try
            {
                var roles = await _rescueTeamService.GetAllRescueTeamRolesAsync();
                var result = roles?.Where(r => r.RescueMembersRoleId > 1)
                                   .Select(r => new
                                   {
                                       teamRoleId = r.RescueMembersRoleId,
                                       roleName = r.RoleName
                                   });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team roles", error = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRescueTeamByTeamId(int id)
        {
            try
            {
                var team = await _rescueTeamService.GetRescueTeamByTeamId(id);
                return Ok(MappingHandle.EntityToDTO(team));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team by id", error = ex.Message });
            }
        }

        [HttpGet("GetRescueTeamByUserId/{id}")]
        public async Task<IActionResult> GetRescueTeamByUserId(int id)
        {
            try
            {
                var teams = await _rescueTeamService.GetRescueTeamByUserId(id);
                if (teams == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });

                return Ok(teams);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team", error = ex.Message });
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateRescueTeam(CreateRescueTeamModel model)
        {
            try
            {
                var rescueTeam = await _rescueTeamService.CreateRescueTeamAsync(new RescueTeam
                {
                    TeamName = model.TeamName,
                    AssemblyLocationText = model.AssemblyLocationText,
                    Location = (model.AssemblyLongitude.HasValue && model.AssemblyLatitude.HasValue) 
                        ? new Point(model.AssemblyLongitude.Value, model.AssemblyLatitude.Value) { SRID = 4326 } 
                        : null!,
                    AssemblyNote = model.AssemblyNote,
                    RoleId = model.RoleId
                });
                if (rescueTeam == null)
                    return BadRequest(new { message = "Failed to create rescue team" });

                // Try to get Manager Name from Claims (assuming JWT has Name or NameIdentifier)
                // If not found, default to "Quản lý"
                string managerName = User.Identity?.Name ?? "Quản lý";
                string managerEmail = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;

                // 1. Broadcast WebSocket Realtime Notification
                var notificationMessage = System.Text.Json.JsonSerializer.Serialize(new
                {
                    Type = "TEAM_CREATED",
                    TeamId = rescueTeam.TeamId,
                    TeamName = rescueTeam.TeamName,
                    Location = rescueTeam.AssemblyLocationText ?? "Chưa có địa điểm",
                    CreatedAt = DateTime.UtcNow
                });
                await _webSocketService.BroadcastMessageAsync(notificationMessage);

                // 2. Send Email Notification to Manager
                if (!string.IsNullOrEmpty(managerEmail))
                {
                    await _emailService.SendTeamCreatedNotificationAsync(
                        to: managerEmail,
                        managerName: managerName,
                        teamName: rescueTeam.TeamName,
                        assemblyLocation: rescueTeam.AssemblyLocationText ?? "Chưa có địa điểm"
                    );
                }

                return CreatedAtAction(nameof(GetRescueTeamByTeamId), new { id = rescueTeam.TeamId }, MappingHandle.EntityToDTO(rescueTeam));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error create rescue team", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRescueTeam(int id, UpdateRescueTeam model)
        {
            try
            {
                var existingTeam = await _rescueTeamService.GetRescueTeamByTeamId(id);
                if (existingTeam == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });
                if (!string.IsNullOrWhiteSpace(model.TeamName))
                    existingTeam.TeamName = model.TeamName;
                existingTeam.StatusId = model.StatusId;

                var result = await _rescueTeamService.UpdateRescueTeamAsync(existingTeam);
                if (!result)
                    return BadRequest(new { message = "Failed to update rescue team" });

                return Ok(new { message = "Rescue team updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating rescue team", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRescueTeam(int id)
        {
            try
            {
                var deletedTeam = await _rescueTeamService.DeleteTeamByIdAsync(id);
                if (deletedTeam == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });

                return Ok(new { message = "Rescue team deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting rescue team", error = ex.Message });
            }
        }
        [HttpGet("GetRescueTeamMembersByTeamId/{id}")]
        public async Task<IActionResult> GetRescueTeamMembersByTeamId(int id)
        {
            try
            {
                var members = await _rescueTeamService.GetAllTeamMemberByTeamIdAsync(id);
                if (members == null || !members.Any())
                    return Ok(new List<object>()); // Trả về list rỗng thay vì 404 để tránh lỗi console
                return Ok(members.Select(m => MappingHandle.EntityToDTO(m)));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team members", error = ex.Message });
            }
        }

        [HttpGet("GetRescueTeamMembersByUserIdAndTeamId/{userId}_{teamId}")]
        public async Task<IActionResult> GetRescueTeamMembersByUserIdAndTeamId(int userId, int teamId)
        {
            try
            {
                var members = await _rescueTeamService.GetRescueTeamMemberByUserIdAndTeamId(userId, teamId);
                if (members == null)
                    return NotFound(new { message = $"No members found for user ID {userId} in rescue team ID {teamId}" });
                return Ok(members);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team members", error = ex.Message });
            }
        }

        [HttpPost("RescueTeamMember")]
        public async Task<IActionResult> AddRescueTeamMember(AddRescueTeamMember model)
        {
            try
            {
                if (model == null)
                    return BadRequest(new { message = "Rescue team data is required" });

                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid data", errors = ModelState });

                var createdTeamMember = await _rescueTeamService.AddTeamMemberAsync(new RescueTeamMember
                {
                    UserId = model.UserId,
                    TeamId = model.TeamId,
                    RoleId = model.RoleId,
                });
                if (createdTeamMember == null)
                    return BadRequest(new { message = "Failed to create rescue team member" });

                return CreatedAtAction(nameof(GetRescueTeamMembersByUserIdAndTeamId),
                    new { userId = createdTeamMember.UserId, teamId = createdTeamMember.TeamId },
                    new { data = createdTeamMember });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error creating rescue team member", error = ex.Message });
            }
        }


        [HttpDelete("RescueTeamMember")]
        public async Task<IActionResult> DeleteRescueTeamMember(DeleteRescueTeamMember model)
        {
            try
            {
                if (model == null)
                    return BadRequest(new { message = "model required" });

                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid data", errors = ModelState });

                var result = await _rescueTeamService.DeleteRescueTeamMember(model.UserId, model.TeamId);

                if (!result)
                    return BadRequest(new { message = "Failed to delete rescue team member" });

                return Ok("Rescue team member deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error creating rescue team member", error = ex.Message });
            }
        }

        [HttpPost("AssignVolunteer")]
        public async Task<IActionResult> AssignVolunteerToTeam([FromBody] AssignVolunteerModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest(new { message = "Data is required" });

                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid data", errors = ModelState });

                // Try get manager id from claims. Provide a fallback if testing without auth.
                int managerId = 1; // Fallback or mock manager id
                var nameIdentifierClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (nameIdentifierClaim != null && int.TryParse(nameIdentifierClaim.Value, out int id))
                {
                    managerId = id;
                }

                var assignedMember = await _rescueTeamService.AssignVolunteerToTeamAsync(
                    targetUserId: model.UserId,
                    teamId: model.TeamId,
                    roleId: model.RoleId,
                    assignedByManagerId: managerId,
                    notifyByEmail: model.NotifyByEmail,
                    note: model.Note
                );

                if (assignedMember == null)
                    return BadRequest(new { message = "Failed to assign volunteer to team." });

                return Ok(new { message = "Volunteer assigned to team successfully.", data = assignedMember });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while assigning volunteer to team.", error = ex.Message });
            }
        }

    }
}
