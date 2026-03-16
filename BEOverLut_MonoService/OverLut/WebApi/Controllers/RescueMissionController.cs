using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using System.Security.Claims;
using WebApi.Models.RescueMissionModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RescueMissionController : ControllerBase
    {
        private readonly IRescueMissionService _rescueMissionService;
        private readonly ILogService _logService;

        public RescueMissionController(IRescueMissionService rescueMissionService, ILogService logService)
        {
            _rescueMissionService = rescueMissionService;
            _logService = logService;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllRescueMission(GetAllRescueMissionModel? model)
        {
            var result = await _rescueMissionService.GetAllRescueMissionAsync(
                model?.missionId, 
                model?.rescueRequestId, 
                model?.coordinatorUserId, 
                model?.teamId, 
                model?.statusId,
                model?.description
            );
            return Ok(result);
        }

        [HttpGet("GetByTeamId/{id}")]
        public async Task<IActionResult> GetRescueMissionByTeamId(int id)
        {
            var result = await _rescueMissionService.GetAllRescueMissionAsync(null, null, null, id, null, null);
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetRescueMissionById(int id)
        {
            var result = await _rescueMissionService.GetRescueMissionByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(MappingHandle.EntityToDTO(result));
        }

        [HttpPost("Add")]
        [Authorize]
        public async Task<IActionResult> AddRescueMission(AddRescueMisstionModel model)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var mission = new RescueMission
            {
                RescueRequestId = model.RescueRequestId,
                TeamId = model.TeamId,
                Description = model.Description,
                CoordinatorUserId = userId,
            };

            var result = await _rescueMissionService.AddRescueMissionAsync(mission, userId);
            if (result == null) return BadRequest("Failed to create mission.");

            return CreatedAtAction(nameof(GetRescueMissionById), new { id = result.MissionId }, MappingHandle.EntityToDTO(result));
        }

        [HttpPut("Update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRescueMission(int id, UpdateRescueMisstionModel model)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            if(await _rescueMissionService.GetRescueMissionByIdAsync(id) == null) return BadRequest("Mission not found.");

            var rescueMission = new RescueMissionDTO
            {
                MissionId = id,
                RescueRequestId = model.RescueRequestId,
                TeamId = model.TeamId,
                Description = model.Description,
                StatusId = model.StatusId
            };

            var result = await _rescueMissionService.UpdateRescueMissionAsync(rescueMission, userId, id);
            if (!result) return BadRequest("Failed to update mission or mission not found.");

            return Ok(result);
        }

    }
}
