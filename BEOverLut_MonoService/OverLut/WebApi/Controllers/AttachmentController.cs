using DTOs.OverlutStorage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentStorageService _attachmentStorageService;

        public AttachmentController(IAttachmentStorageService attachmentStorageService)
        {
            _attachmentStorageService = attachmentStorageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAttachments()
        {
            try
            {
                var attachments = await _attachmentStorageService.GetAllAttachments();
                return Ok(attachments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving attachments", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttachmentById(Guid id)
        {
            try
            {
                var attachment = await _attachmentStorageService.GetAttachmentById(id);
                if (attachment == null)
                    return NotFound(new { message = $"Attachment with ID {id} not found" });

                return Ok(attachment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving attachment", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAttachment(AttachmentDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Attachment data is required" });

                var createdAttachment = await _attachmentStorageService.CreateAttachment(dto);
                if (createdAttachment == null)
                    return BadRequest(new { message = "Failed to create attachment" });

                return CreatedAtAction(nameof(GetAttachmentById), new { id = createdAttachment.AttachmentId }, createdAttachment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating attachment", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttachment(Guid id, AttachmentDTO dto)
        {
            try
            {
                var existingAttachment = await _attachmentStorageService.GetAttachmentById(id);
                if (existingAttachment == null)
                    return NotFound(new { message = $"Attachment with ID {id} not found" });

                dto.AttachmentId = id;
                var result = await _attachmentStorageService.UpdateAttachment(dto);
                if (!result)
                    return BadRequest(new { message = "Failed to update attachment" });

                return Ok(new { message = "Attachment updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating attachment", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttachment(Guid id)
        {
            try
            {
                var attachment = await _attachmentStorageService.GetAttachmentById(id);
                if (attachment == null)
                    return NotFound(new { message = $"Attachment with ID {id} not found" });

                var result = await _attachmentStorageService.DeleteAttachment(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete attachment" });

                return Ok(new { message = "Attachment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting attachment", error = ex.Message });
            }
        }

        // --- NEW CHUNKED UPLOAD APIs ---

        [HttpPost("rescue/create-attachment")]
        public async Task<IActionResult> CreateAttachmentRescue([FromBody] WebApi.Models.AttachmentModel.CreateAttachmentRescueModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _attachmentStorageService.CreateAttachmentRescueAsync(model.RescueRequestId, model.FileSize, model.FileType);
                if (id == null) return BadRequest(new { message = "Failed to create rescue attachment" });

                return Ok(new { attachmentId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating attachment", error = ex.Message });
            }
        }

        [HttpPost("mission/create-attachment")]
        public async Task<IActionResult> CreateAttachmentMission([FromBody] WebApi.Models.AttachmentModel.CreateAttachmentMissionModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var id = await _attachmentStorageService.CreateAttachmentMissionAsync(model.MissionId, model.FileSize, model.FileType);
                if (id == null) return BadRequest(new { message = "Failed to create mission attachment" });

                return Ok(new { attachmentId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating attachment", error = ex.Message });
            }
        }

        [HttpPost("chunk")]
        public async Task<IActionResult> AddFileChunk([FromForm] WebApi.Models.AttachmentModel.FileChunkUploadModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (model.FileChunk == null || model.FileChunk.Length == 0)
                    return BadRequest(new { message = "Chunk data is empty" });

                using var memoryStream = new MemoryStream();
                await model.FileChunk.CopyToAsync(memoryStream);
                var data = memoryStream.ToArray();

                var success = await _attachmentStorageService.AddFileChunkAsync(model.AttachmentId, model.SequenceNumber, data, model.IsLastChunk);
                if (!success)
                    return BadRequest(new { message = "Failed to add chunk" });

                return Ok(new { message = "Chunk added successfully", isComplete = model.IsLastChunk });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding chunk", error = ex.Message });
            }
        }

        [HttpGet("rescue/{rescueId}")]
        public async Task<IActionResult> GetAttachmentsByRescueId(int rescueId)
        {
            try
            {
                var result = await _attachmentStorageService.GetAttachmentsByRescueRequestIdAsync(rescueId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving attachments", error = ex.Message });
            }
        }

        [HttpGet("mission/{missionId}")]
        public async Task<IActionResult> GetAttachmentsByMissionId(int missionId)
        {
            try
            {
                var result = await _attachmentStorageService.GetAttachmentsByMissionIdAsync(missionId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving attachments", error = ex.Message });
            }
        }
    }
}
