using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Login()
        {
            return Ok();
        }
        public IActionResult Logout()
        {
            return Ok();
        }
        public IActionResult GetRefreshToken()
        {
            return Ok();
        }
        public IActionResult RevokeRefreshToken()
        {
            return Ok();
        }

    }
}
