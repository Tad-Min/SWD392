using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using DTOs.Overlut;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusService _statusService;

        public StatusController(IStatusService statusService)
        {
            _statusService = statusService;
        }

        #region RescueMissionsStatus

        [HttpGet("RescueMissions")]
        public async Task<IActionResult> GetAllRescueMissionsStatus([FromQuery] string? statusName)
        {
            var result = await _statusService.GetAllRescueMissionsStatus(statusName);
            return Ok(result);
        }

        [HttpGet("RescueMissions/{id}")]
        public async Task<IActionResult> GetRescueMissionsStatusById(int id)
        {
            var result = await _statusService.GetRescueMissionsStatusById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("RescueMissions")]
        public async Task<IActionResult> CreateRescueMissionsStatus([FromBody] RescueMissionsStatusDTO status)
        {
            var result = await _statusService.CreateRescueMissionsStatus(status);
            if (result == null) return BadRequest("Failed to create status.");
            return Ok(result);
        }

        [HttpPut("RescueMissions")]
        public async Task<IActionResult> UpdateRescueMissionsStatus([FromBody] RescueMissionsStatusDTO status)
        {
            var result = await _statusService.UpdateRescueMissionsStatus(status);
            if (!result) return NotFound("Status not found or update failed.");
            return Ok(result);
        }

        [HttpDelete("RescueMissions/{id}")]
        public async Task<IActionResult> DeleteRescueMissionsStatus(int id)
        {
            var result = await _statusService.DeleteRescueMissionsStatus(id);
            if (!result) return NotFound("Status not found or delete failed.");
            return Ok(result);
        }

        #endregion

        #region RescueRequestsStatus

        [HttpGet("RescueRequests")]
        public async Task<IActionResult> GetAllRescueRequestsStatus([FromQuery] string? statusName)
        {
            var result = await _statusService.GetAllRescueRequestsStatus(statusName);
            return Ok(result);
        }

        [HttpGet("RescueRequests/{id}")]
        public async Task<IActionResult> GetRescueRequestsStatusById(int id)
        {
            var result = await _statusService.GetRescueRequestsStatusById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("RescueRequests")]
        public async Task<IActionResult> CreateRescueRequestsStatus([FromBody] RescueRequestsStatusDTO status)
        {
            var result = await _statusService.CreateRescueRequestsStatus(status);
            if (result == null) return BadRequest("Failed to create status.");
            return Ok(result);
        }

        [HttpPut("RescueRequests")]
        public async Task<IActionResult> UpdateRescueRequestsStatus([FromBody] RescueRequestsStatusDTO status)
        {
            var result = await _statusService.UpdateRescueRequestsStatus(status);
            if (!result) return NotFound("Status not found or update failed.");
            return Ok(result);
        }

        [HttpDelete("RescueRequests/{id}")]
        public async Task<IActionResult> DeleteRescueRequestsStatus(int id)
        {
            var result = await _statusService.DeleteRescueRequestsStatus(id);
            if (!result) return NotFound("Status not found or delete failed.");
            return Ok(result);
        }

        #endregion

        #region RescueTeamsStatus

        [HttpGet("RescueTeams")]
        public async Task<IActionResult> GetAllRescueTeamsStatus([FromQuery] string? statusName)
        {
            var result = await _statusService.GetAllRescueTeamsStatus(statusName);
            return Ok(result);
        }

        [HttpGet("RescueTeams/{id}")]
        public async Task<IActionResult> GetRescueTeamsStatusById(int id)
        {
            var result = await _statusService.GetRescueTeamsStatusById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("RescueTeams")]
        public async Task<IActionResult> CreateRescueTeamsStatus([FromBody] RescueTeamsStatusDTO status)
        {
            var result = await _statusService.CreateRescueTeamsStatus(status);
            if (result == null) return BadRequest("Failed to create status.");
            return Ok(result);
        }

        [HttpPut("RescueTeams")]
        public async Task<IActionResult> UpdateRescueTeamsStatus([FromBody] RescueTeamsStatusDTO status)
        {
            var result = await _statusService.UpdateRescueTeamsStatus(status);
            if (!result) return NotFound("Status not found or update failed.");
            return Ok(result);
        }

        [HttpDelete("RescueTeams/{id}")]
        public async Task<IActionResult> DeleteRescueTeamsStatus(int id)
        {
            var result = await _statusService.DeleteRescueTeamsStatus(id);
            if (!result) return NotFound("Status not found or delete failed.");
            return Ok(result);
        }

        #endregion

        #region VehiclesStatus

        [HttpGet("Vehicles")]
        public async Task<IActionResult> GetAllVehiclesStatus([FromQuery] string? statusName)
        {
            var result = await _statusService.GetAllVehiclesStatus(statusName);
            return Ok(result);
        }

        [HttpGet("Vehicles/{id}")]
        public async Task<IActionResult> GetVehiclesStatusById(int id)
        {
            var result = await _statusService.GetVehiclesStatusById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("Vehicles")]
        public async Task<IActionResult> CreateVehiclesStatus([FromBody] VehiclesStatusDTO status)
        {
            var result = await _statusService.CreateVehiclesStatus(status);
            if (result == null) return BadRequest("Failed to create status.");
            return Ok(result);
        }

        [HttpPut("Vehicles")]
        public async Task<IActionResult> UpdateVehiclesStatus([FromBody] VehiclesStatusDTO status)
        {
            var result = await _statusService.UpdateVehiclesStatus(status);
            if (!result) return NotFound("Status not found or update failed.");
            return Ok(result);
        }

        [HttpDelete("Vehicles/{id}")]
        public async Task<IActionResult> DeleteVehiclesStatus(int id)
        {
            var result = await _statusService.DeleteVehiclesStatus(id);
            if (!result) return NotFound("Status not found or delete failed.");
            return Ok(result);
        }

        #endregion
    }
}
