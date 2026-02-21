using System.Runtime.CompilerServices;
using System.Security.Claims;
using BusinessObject.OverlutEntiy;
using DTOs.Overlut;
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
        private IUserService iUserService;

        public RescueRequestController (
            IRescueRequestService iRescueRequestService, 
            IUserService iUserService)
        {
            this.iRescueRequestService = iRescueRequestService;
            this.iUserService = iUserService;
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
        public async Task<IActionResult> UpdateRescueRequest()
        {
            return Ok();
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
