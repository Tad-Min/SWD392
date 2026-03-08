using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrgencyLevelController : ControllerBase
    {
        private readonly IUrgencyLevelService _urgencyLevelService;

        public UrgencyLevelController(IUrgencyLevelService urgencyLevelService)
        {
            _urgencyLevelService = urgencyLevelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUrgencyLevels()
        {
            try
            {
                var levels = await _urgencyLevelService.GetAllUrgencyLevelsAsync();
                if (levels == null || !levels.Any())
                    return NotFound(new { message = "No urgency levels found" });

                return Ok(levels);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving urgency levels", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUrgencyLevelById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid urgency level ID" });

                var level = await _urgencyLevelService.GetUrgencyLevelByIdAsync(id);
                if (level == null)
                    return NotFound(new { message = $"Urgency level with ID {id} not found" });

                return Ok(level);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error retrieving urgency level", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUrgencyLevel([FromBody] string urgencyName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(urgencyName))
                    return BadRequest(new { message = "Urgency level name is required" });

                var createdLevel = await _urgencyLevelService.CreateUrgencyLevelAsync(urgencyName);
                if (createdLevel == null)
                    return BadRequest(new { message = "Failed to create urgency level" });

                return CreatedAtAction(nameof(GetUrgencyLevelById),
                    new { id = createdLevel.UrgencyLevelId }, createdLevel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error creating urgency level", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUrgencyLevel(int id, [FromBody] string urgencyName)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid urgency level ID" });

                if (string.IsNullOrWhiteSpace(urgencyName))
                    return BadRequest(new { message = "Urgency level name is required" });

                var existingLevel = await _urgencyLevelService.GetUrgencyLevelByIdAsync(id);
                if (existingLevel == null)
                    return NotFound(new { message = $"Urgency level with ID {id} not found" });

                var result = await _urgencyLevelService.UpdateUrgencyLevelAsync(id, urgencyName);
                if (!result)
                    return BadRequest(new { message = "Failed to update urgency level" });

                return Ok(new { message = "Urgency level updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error updating urgency level", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUrgencyLevel(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid urgency level ID" });

                var existingLevel = await _urgencyLevelService.GetUrgencyLevelByIdAsync(id);
                if (existingLevel == null)
                    return NotFound(new { message = $"Urgency level with ID {id} not found" });

                var result = await _urgencyLevelService.DeleteUrgencyLevelByIdAsync(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete urgency level" });

                return Ok(new { message = "Urgency level deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error deleting urgency level", error = ex.Message });
            }
        }
    }
}
