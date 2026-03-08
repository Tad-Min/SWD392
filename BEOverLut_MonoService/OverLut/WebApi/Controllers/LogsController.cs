using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        /// <summary>
        /// Get all rescue request logs
        /// </summary>
        [HttpGet("rescue-request")]
        public async Task<IActionResult> GetLogsRescueRequest()
        {
            try
            {
                var logs = await _logService.GetAllRescueRequestLogsAsync();
                if (logs == null || !logs.Any())
                    return NotFound(new { message = "No rescue request logs found" });

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving rescue request logs", error = ex.Message });
            }
        }

        /// <summary>
        /// Get rescue request logs by request ID
        /// </summary>
        [HttpGet("rescue-request/{requestId}")]
        public async Task<IActionResult> GetLogsRescueRequestByRequestId(int requestId)
        {
            try
            {
                if (requestId <= 0)
                    return BadRequest(new { message = "Invalid rescue request ID" });

                var logs = await _logService.GetAllRescueRequestLogsByIdAsync(requestId);
                if (logs == null || !logs.Any())
                    return NotFound(new { message = $"No logs found for rescue request ID {requestId}" });

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving rescue request logs", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all mission logs
        /// </summary>
        [HttpGet("mission")]
        public async Task<IActionResult> GetLogsMission()
        {
            try
            {
                var logs = await _logService.GetAllMissionLogsAsync();
                if (logs == null || !logs.Any())
                    return NotFound(new { message = "No mission logs found" });

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving mission logs", error = ex.Message });
            }
        }

        /// <summary>
        /// Get mission logs by mission ID
        /// </summary>
        [HttpGet("mission/{missionId}")]
        public async Task<IActionResult> GetLogsMissionByMissionId(int missionId)
        {
            try
            {
                if (missionId <= 0)
                    return BadRequest(new { message = "Invalid mission ID" });

                var logs = await _logService.GetAllMissionLogsByIdAsync(missionId);
                if (logs == null || !logs.Any())
                    return NotFound(new { message = $"No logs found for mission ID {missionId}" });

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving mission logs", error = ex.Message });
            }
        }
    }
}
