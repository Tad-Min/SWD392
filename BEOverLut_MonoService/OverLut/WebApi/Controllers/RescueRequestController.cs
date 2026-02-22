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
            return Ok(await iRescueRequestService.GetAllRescueRequestsAsync(model?.rescueRequestId,model?.userReqId,model?.requestType,model?.urgencyLevel,model?.status,model?.description));
        }
        [HttpGet("GetById{id}")]
        public async Task<IActionResult> GetRescueRequestById(int id)
        {
            return Ok(await iRescueRequestService.GetRescueRequestByIdAsync(id));
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddRescueRequest(CreateRescueRequestModel model)
        {
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
                    LocationText = model.LocationText,
                    Ipaddress = GetClientIp(HttpContext),
                    UserAgent = GetUserAgent(HttpContext),
                });
            }

            return Ok(recq);
        }
        [HttpPut("Update")]
        [Authorize]
        public async Task<IActionResult> UpdateRescueRequest(UpdateRescueRequestModel model)
        {

            
            if (model == null) return BadRequest(ModelState);
            var rescue = MappingHandle.EntityToDTO(await iRescueRequestService.GetRescueRequestByIdAsync(model.RescueRequestId));
            if (rescue == null) return BadRequest("Not found rescue request");
            
            var logCheck = await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
            {
                RescueRequestId = model.RescueRequestId,
                ChangedByUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                OldRescueRequests = JsonSerializer.Serialize(rescue),
            }) ?? throw new Exception("Can't write log");
            
            rescue.LocationText = model.LocationText;
            rescue.PeopleCount = model.PeopleCount;
            rescue.Status = model.Status;
            rescue.UrgencyLevel = model.UrgencyLevel;
            rescue.RequestType = model.RequestType;
            return Ok(await iRescueRequestService.UpdateRescueRequestAsync(rescue));
        }
        [HttpPatch("UpdateLocation")]
        public async Task<IActionResult> UpdateLocation(UpdateLocationModel model)
        {
            if (model == null) return BadRequest(ModelState);
            var rescue = MappingHandle.EntityToDTO(await iRescueRequestService.GetRescueRequestByIdAsync(model.RescueRequestId));
            if (rescue == null) return BadRequest("Not found rescue request");
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (int.TryParse(userIdString, out int userId))
                {
                    var lg = await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
                    {
                        ChangedByUserId = userId,
                        RescueRequestId = model.RescueRequestId,
                        OldRescueRequests = JsonSerializer.Serialize(rescue),
                    }) ?? throw new Exception("Can't Create log");
                }
            }
            else
            {
                await iLogService.AddRescueRequestLogAsync(new RescueRequestLog
                {
                    RescueRequestId = model.RescueRequestId,
                    OldRescueRequests = JsonSerializer.Serialize(rescue),
                });
            }
            rescue.Location = model.CurrentLocation;
            return Ok(await iRescueRequestService.UpdateRescueRequestAsync(rescue));
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
