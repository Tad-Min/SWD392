using BusinessObject.OverlutEntiy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

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
        public async Task<IActionResult> GetRescueTeamById(int id)
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRescueTeam(int id, RescueTeam rescueTeam)
        {
            try
            {
                var teams = await _rescueTeamService.GetAllRescueTeamsAsync(id, null, null);
                var existingTeam = teams?.FirstOrDefault();
                if (existingTeam == null)
                    return NotFound(new { message = $"Rescue team with ID {id} not found" });

                rescueTeam.TeamId = id;
                var result = await _rescueTeamService.UpdateRescueTeamAsync(rescueTeam);
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
    }
}
