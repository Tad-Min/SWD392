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
    }
}
