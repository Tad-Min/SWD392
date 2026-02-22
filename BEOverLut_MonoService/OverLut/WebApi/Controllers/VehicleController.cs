using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        //All data must be retrieved from the Service Layer.
        //All method must follow Restfull API
        //All method must handel Error
    }
}
