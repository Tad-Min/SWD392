using DTOs;
using DTOs.Appsettings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Interface;
using WebApi.Models.AuthModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService iAuthService;
        private readonly IUserService iUserService;

        public AuthController(IAuthService iAuthService,
            IUserService iUserService)
        {
            this.iAuthService = iAuthService;
            this.iUserService = iUserService;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterModel registerModel) 
        {
            try
            {
                if (await iUserService.GetUserByEmailAsync(registerModel.Email) != null)
                {
                    return BadRequest("Email already exists!");
                }
                return Ok(MappingHandle.EntityToDTO(await iAuthService.RegisterAsync(registerModel.Email, registerModel.Password)??null!));
            }
            catch {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel login)
        {
            try
            {
                if (await iUserService.GetUserByEmailAsync(login.Email) == null)
                {
                    return BadRequest("User not found!");
                }
                var user = await iUserService.GetUserByEmailAndPassword(login.Email, login.Password);
                if (user == null)
                {
                    return BadRequest("Wrong email or password!");
                }
                var refToken = await iAuthService.GenerateRefreshTokenAsync(user, GetUserAgent(HttpContext), GetClientIp(HttpContext));
                if (refToken == null)
                {
                    throw new Exception("Can't generate token");
                }
                var accessToken = await iAuthService.GenerateAccessTokenAsync(user, refToken);
                if (accessToken == null) {
                    throw new Exception("Can't generate token");
                }
                return Ok(new ReturnLoginModel
                {
                    UserId = user.UserId,
                    UserName = user.FullName??"",
                    Token = accessToken,
                    RefreshToken = refToken,
                });
            }
            catch {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout(LogoutModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest("Invalid logout request.");
                }   
                return Ok(await iAuthService.LogoutAsync(model.UserId,model.RefeshToken));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPost("GetAccessToken")]
        public async Task<IActionResult> GetAccessToken(GetAccessTokenModel model)
        {
            try
            {
                var user = await iUserService.GetUserByIdAsync(model.UserId);
                if ( user == null)
                {
                    return BadRequest("User not found!");
                }

                return Ok(await iAuthService.GenerateAccessTokenAsync(user, model.RefeshToken));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
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
