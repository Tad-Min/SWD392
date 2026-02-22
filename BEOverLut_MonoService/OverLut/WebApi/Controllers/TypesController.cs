using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using DTOs.Overlut;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesController : ControllerBase
    {
        private readonly ITypesService _typesService;

        public TypesController(ITypesService typesService)
        {
            _typesService = typesService;
        }

        #region RescueRequestsType

        [HttpGet("RescueRequests")]
        public async Task<IActionResult> GetAllRescueRequestsType([FromQuery] string? typeName)
        {
            var result = await _typesService.GetAllRescueRequestsType(typeName);
            return Ok(result);
        }

        [HttpGet("RescueRequests/{id}")]
        public async Task<IActionResult> GetRescueRequestsTypeById(int id)
        {
            var result = await _typesService.GetRescueRequestsTypeById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("RescueRequests")]
        public async Task<IActionResult> CreateRescueRequestsType([FromBody] RescueRequestsTypeDTO type)
        {
            var result = await _typesService.CreateRescueRequestsType(type);
            if (result == null) return BadRequest("Failed to create type.");
            return Ok(result);
        }

        [HttpPut("RescueRequests")]
        public async Task<IActionResult> UpdateRescueRequestsType([FromBody] RescueRequestsTypeDTO type)
        {
            var result = await _typesService.UpdateRescueRequestsType(type);
            if (!result) return NotFound("Type not found or update failed.");
            return Ok("Update successful.");
        }

        [HttpDelete("RescueRequests/{id}")]
        public async Task<IActionResult> DeleteRescueRequestsType(int id)
        {
            var result = await _typesService.DeleteRescueRequestsType(id);
            if (!result) return NotFound("Type not found or delete failed.");
            return Ok("Delete successful.");
        }

        #endregion

        #region VehiclesType

        [HttpGet("Vehicles")]
        public async Task<IActionResult> GetAllVehiclesType([FromQuery] string? typeName)
        {
            var result = await _typesService.GetAllVehiclesType(typeName);
            return Ok(result);
        }

        [HttpGet("Vehicles/{id}")]
        public async Task<IActionResult> GetVehiclesTypeById(int id)
        {
            var result = await _typesService.GetVehiclesTypeById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("Vehicles")]
        public async Task<IActionResult> CreateVehiclesType([FromBody] VehiclesTypeDTO type)
        {
            var result = await _typesService.CreateVehiclesType(type);
            if (result == null) return BadRequest("Failed to create type.");
            return Ok(result);
        }

        [HttpPut("Vehicles")]
        public async Task<IActionResult> UpdateVehiclesType([FromBody] VehiclesTypeDTO type)
        {
            var result = await _typesService.UpdateVehiclesType(type);
            if (!result) return NotFound("Type not found or update failed.");
            return Ok("Update successful.");
        }

        [HttpDelete("Vehicles/{id}")]
        public async Task<IActionResult> DeleteVehiclesType(int id)
        {
            var result = await _typesService.DeleteVehiclesType(id);
            if (!result) return NotFound("Type not found or delete failed.");
            return Ok("Delete successful.");
        }

        #endregion
    }
}
