using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text.Json;
using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;
using Services;
using Services.Interface;
using WebApi.Models.RescueRequestModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RescueRequestController : ControllerBase
    {
        private IRescueRequestService iRescueRequestService;
        private ILogService iLogService;
        private IUserService iUserService;

        public RescueRequestController (
            IRescueRequestService iRescueRequestService,
            ILogService iLogService,
            IUserService iUserService)
        {
            this.iRescueRequestService = iRescueRequestService;
            this.iLogService = iLogService;
            this.iUserService = iUserService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllRescueRequest(GetAllRescueRequestModel? model)
        {
            try
            {
                var rescueRequest = await iRescueRequestService.GetAllRescueRequestsAsync(model?.rescueRequestId, model?.userReqId, model?.requestType, model?.urgencyLevel, model?.status, model?.description);
                return Ok(rescueRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescuerequest", error = ex.Message });
            }
        }
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetRescueRequestById(int id)
        {
            try
            {
                var rescueRequest = await iRescueRequestService.GetRescueRequestByIdAsync(id);
                if (rescueRequest == null)
                    return NotFound(new { message = $"RescueRequest with ID {id} not found" });
                return Ok(rescueRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving rescuerequest", error = ex.Message });
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddRescueRequest(CreateRescueRequestModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest(new { message = "RescueRequest data is required" });
                RescueRequestDTO? recq = null;

                if (User.Identity != null && User.Identity.IsAuthenticated)
                {
                    string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (int.TryParse(userIdString, out int userId))
                    {
                        recq = await iRescueRequestService.AddRescueRequestAsync(new RescueRequestDTO
                        {
                            UserReqId = userId,
                            Description = model.Description,
                            RequestType = model.RequestType,
                            Location = model.Currentlocation,
                            LocationText = model.LocationText,
                            Ipaddress = GetClientIp(HttpContext),
                            UserAgent = GetUserAgent(HttpContext),
                        });
                    }
                }
                else
                {
                    recq = await iRescueRequestService.AddRescueRequestAsync(new RescueRequestDTO
                    {
                        Description = model.Description,
                        Location = model.Currentlocation,
                        RequestType = model.RequestType,
                        LocationText = model.LocationText,
                        Ipaddress = GetClientIp(HttpContext),
                        UserAgent = GetUserAgent(HttpContext),
                    });
                }
                if (recq == null)
                    return BadRequest(new { message = "Failed to create RescueRequest" });
                return CreatedAtAction(nameof(GetRescueRequestById), new { id = recq.RescueRequestId }, recq);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error add rescuerequest", error = ex.Message });

            }
            
        }
        [HttpPut("Update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateRescueRequest(int id, UpdateRescueRequestModel model)
        {
            try
            {
                var existingRescueRequest = await iRescueRequestService.GetRescueRequestByIdAsync(id);
                if (existingRescueRequest == null)
                    return NotFound(new { message = $"RescueRequest with ID {id} not found" });
                var logCheck = await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
                {
                    RescueRequestId = id,
                    ChangedByUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                    OldRescueRequests = JsonSerializer.Serialize(MappingHandle.EntityToDTO(existingRescueRequest)),
                }) ?? throw new Exception("Can't write log");
                existingRescueRequest.RequestType = model.RequestType;
                existingRescueRequest.UrgencyLevel = model.UrgencyLevel;
                existingRescueRequest.Status = model.Status;
                existingRescueRequest.PeopleCount = model.PeopleCount;
                existingRescueRequest.LocationText = model.LocationText;

                var result = await iRescueRequestService.UpdateRescueRequestAsync(existingRescueRequest);
                if (!result)
                    return BadRequest(new { message = "Failed to update warehouse" });
                return Ok("RescueRequest updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating rescuerequest", error = ex.Message });
            }
            
        }
        [HttpPatch("UpdateLocation/{id}")]
        public async Task<IActionResult> UpdateLocation(int id, UpdateLocationModel model)
        {
            var existingRescueRequest = await iRescueRequestService.GetRescueRequestByIdAsync(id);
            if (existingRescueRequest == null)
                return NotFound(new { message = $"RescueRequest with ID {id} not found" });
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (int.TryParse(userIdString, out int userId))
                {
                    var lg = await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
                    {
                        ChangedByUserId = userId,
                        RescueRequestId = model.RescueRequestId,
                        OldRescueRequests = JsonSerializer.Serialize(MappingHandle.EntityToDTO(existingRescueRequest)),
                    }) ?? throw new Exception("Can't Create log");
                }
            }
            else
            {
                await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
                {
                    RescueRequestId = model.RescueRequestId,
                    OldRescueRequests = JsonSerializer.Serialize(MappingHandle.EntityToDTO(existingRescueRequest)),
                });
            }
            existingRescueRequest.Location = model.CurrentLocation;
            var result = await iRescueRequestService.UpdateRescueRequestAsync(existingRescueRequest);
            if (!result)
                return BadRequest(new { message = "Failed to update location" });
            return Ok("RescueRequest updated successfully");
        }
        private string GetUserAgent(HttpContext context)
        {
            return context.Request.Headers["User-Agent"].FirstOrDefault() ?? string.Empty;
        }
        private string? GetClientIp(HttpContext context)
        {
            string? ip = string.Empty;

            // Check X-Forwarded-For 
            var forwardedHeader = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedHeader))
            {
                // Nó có thể chứa chuỗi: "client, proxy1, proxy2" -> Lấy cái đầu tiên
                ip = forwardedHeader.Split(',')[0].Trim();
            }

            // X-Real-IP
            if (string.IsNullOrEmpty(ip))
            {
                ip = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            }

            // Connection.RemoteIpAddress
            if (string.IsNullOrEmpty(ip))
            {
                ip = context.Connection.RemoteIpAddress?.ToString();
            }
            return ip;
        }
    }
}
