using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using WebApi.Models.RescueTeamModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RescueTeamController : ControllerBase
    {
        private readonly IRescueTeamService _rescueTeamService;

        public RescueTeamController(IRescueTeamService rescueTeamService)
        {
            _rescueTeamService = rescueTeamService;
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
        [HttpGet("{id}")]
        async Task<IActionResult> GetRescueTeamByTeamId(int id)
        {
            try
            {
                var team = await _rescueTeamService.GetRescueTeamByTeamId(id);
                return Ok(team);
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
                var teams = await _rescueTeamService.GetAllRescueTeamsAsync(id, null, null);
                var team = teams?.FirstOrDefault();
                if (team == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });

                return Ok(team);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescue team", error = ex.Message });
            }
        }

        [HttpGet("GetRescueTeamMembersByTeamId/{id}")]
        public async Task<IActionResult> GetRescueTeamMembersByTeamId(int id)
        {
            try
            {
                var members = await _rescueTeamService.GetAllTeamMemberByTeamIdAsync(id);
                if (members == null || !members.Any())
                    return NotFound(new { message = $"No members found for rescue team with ID {id}" });
                return Ok(members);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRescueTeam(int id, UpdateRescueTeam model)
        {
            try
            {
                var existingTeam = await _rescueTeamService.GetRescueTeamByTeamId(id);
                if (existingTeam == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });
                if(!string.IsNullOrWhiteSpace(model.TeamName))
                    existingTeam.TeamName=model.TeamName;
                existingTeam.StatusId =model.StatusId;

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

        [HttpPost]
        public async Task<IActionResult> CreateRescueTeam(CreateRescueTeamModel model)
        {
            try
            {
                var rescueTeam = await _rescueTeamService.CreateRescueTeamAsync(new RescueTeam
                {
                    TeamName = model.TeamName
                });
                if (rescueTeam == null)
                    BadRequest(new { message = "Failed to create rescue team" });
                return CreatedAtAction(nameof(GetRescueTeamByTeamId), new { id = rescueTeam!.TeamId }, rescueTeam);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error create rescue team", error = ex.Message });
            }
        }
       
        
    }
}
