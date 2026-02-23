using DTOs.Overlut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using WebApi.Models.VehicleModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        //All data must be retrieved from the Service Layer.
        //All method must follow Restfull API
        //All method must handel Error
        #region Vehicle Assignment
        [HttpGet("AssignVehicle")]
        public async Task<IActionResult> GetAllAssignVehicle(GetAllAssignVehicleModel? model)
        {
            try
            {
                var assignVehicles = await _vehicleService.GetAllAssignVehicle(model?.missionId, model?.vehicleId, model?.assignedAt, model?.releasedAt);
                return Ok(assignVehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving assigned vehicles", error = ex.Message });
            }
        }

        [HttpGet("AssignVehicle/{id}")]
        public async Task<IActionResult> GetAssignVehicleById(int id)
        {
            try
            {
                var assignVehicle = await _vehicleService.GetAssignVehicleById(id);
                if (assignVehicle == null)
                    return NotFound(new { message = $"Assignment with ID {id} not found" });

                return Ok(assignVehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving vehicle assignment", error = ex.Message });
            }
        }

        [HttpGet("AssignVehicle/MissionId/{id}")]
        public async Task<IActionResult> GetVehicleAssignmentByMissionId(int id)
        {
            try
            {
                var assignVehicles = await _vehicleService.GetVehicleAssignmentByMissionId(id);
                return Ok(assignVehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving vehicle assignments by mission", error = ex.Message });
            }
        }

        [HttpPost("AssignVehicle")]
        public async Task<IActionResult> CreateAssignVehicle(CreateAssignVehicleModel model)
        {
            try
            {
                if (await _vehicleService.GetVehicleById(model.VehicleId) == null)
                    return BadRequest(new { message = $"Vehicle with ID {model.VehicleId} not found" });

                if (!await _vehicleService.IsVehicleRelease(model.VehicleId))
                    return BadRequest(new { message = $"Vehicle with ID {model.VehicleId} is currently in use" });

                var assignVehicle = await _vehicleService.CreateAssignVehicle(new VehicleAssignmentDTO
                {
                    MissionId = model.MissionId,
                    VehicleId = model.VehicleId
                });
                if (assignVehicle == null)
                    return BadRequest(new { message = $"Can't Create assignVehicle" });
                return CreatedAtAction(nameof(GetAssignVehicleById), new { id = assignVehicle?.VehicleId }, assignVehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating vehicle assignment", error = ex.Message });
            }
        }

        [HttpPut("AssignVehicle/Release{id}")]
        public async Task<IActionResult> ReleaseAssignVehicle(int id)
        {
            try
            {
                if (await _vehicleService.GetVehicleById(id) == null)
                    return BadRequest(new { message = $"Vehicle with ID {id} not found" });

                if (await _vehicleService.IsVehicleRelease(id)) 
                    return BadRequest(new { message = $"Vehicle with ID {id} is not currently assigned" });

                var existingAssignment = await _vehicleService.GetAssignVehicleById(id);
                if (existingAssignment == null)
                    return NotFound(new { message = $"Assignment with ID {id} not found" });

                var result = await _vehicleService.
                if (!result)
                    return BadRequest(new { message = "Failed to release vehicle assignment" });

                return Ok(new { message = "Vehicle assignment released successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error releasing vehicle assignment", error = ex.Message });
            }
        }
        #endregion

        #region Vehicle
        [HttpGet("Vehicle")]
        public async Task<IActionResult> GetAllVehicle([FromQuery] GetAllVehicleModel? model)
        {
            try
            {
                var vehicles = await _vehicleService.GetAllVehicles(model?.status, model?.type, model?.available);
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving vehicles", error = ex.Message });
            }
        }

        [HttpGet("Vehicle/{id}")]
        public async Task<IActionResult> GetVehicleById(int id)
        {
            try
            {
                var vehicle = await _vehicleService.GetVehicleById(id);
                if (vehicle == null)
                    return NotFound(new { message = $"Vehicle with ID {id} not found" });

                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving vehicle", error = ex.Message });
            }
        }

        [HttpPost("Vehicle")]
        public async Task<IActionResult> CreateVehicle(VehicleDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Vehicle data is required" });

                var createdVehicle = await _vehicleService.CreateVehicle(dto);
                return CreatedAtAction(nameof(GetVehicleById), new { id = createdVehicle.Id }, createdVehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating vehicle", error = ex.Message });
            }
        }

        [HttpPut("Vehicle/{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, VehicleDTO dto)
        {
            try
            {
                var existingVehicle = await _vehicleService.GetVehicleById(id);
                if (existingVehicle == null)
                    return NotFound(new { message = $"Vehicle with ID {id} not found" });

                var result = await _vehicleService.UpdateVehicle(id, dto);
                if (!result)
                    return BadRequest(new { message = "Failed to update vehicle" });

                return Ok(new { message = "Vehicle updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating vehicle", error = ex.Message });
            }
        }

        [HttpDelete("Vehicle/{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            try
            {
                var vehicle = await _vehicleService.GetVehicleById(id);
                if (vehicle == null)
                    return NotFound(new { message = $"Vehicle with ID {id} not found" });

                var result = await _vehicleService.DeleteVehicle(id);
                if (!result)
                    return BadRequest(new { message = "Failed to delete vehicle" });

                return Ok(new { message = "Vehicle deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting vehicle", error = ex.Message });
            }
        }
        #endregion
    }
}
