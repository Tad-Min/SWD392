using BusinessObject.OverlutEntiy;
using DTOs;
using DTOs.Overlut;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;
using Services.Interface;
using WebApi.Models.RescueTeamModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRolesService _rolesService;

        public RolesController(IRolesService rolesService)
        {
            _rolesService = rolesService;
        }


        #region UserRoles
        [HttpGet("UserRole")]

        public async Task<IActionResult> GetUserRoles()
        {
            try
            {
                return Ok(await _rolesService.GetUserRolesAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Get All User Roles", error = ex.Message });

            }
        }
        [HttpGet("UserRole/{id}")]
        public async Task<IActionResult> GetUserRoleById(int id)
        {
            try
            {
                return Ok(await _rolesService.GetUserRoleByIdAsync(id));

            }
            catch (Exception ex)
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Get User Roles", error = ex.Message });

            }
        }
        [HttpPost("UserRole")]
        public async Task<IActionResult> CreateUserRole(RoleDTO model)
        {
            try
            {
                var existingRole = await _rolesService.GetUserRoleByIdAsync(model.RoleId);
                if (existingRole != null) return BadRequest(new { message = $"User role with ID {model.RoleId} already exists" });
                var createdRole = await _rolesService.CreateUserRoleAsync(model.RoleId, model.RoleName);

                if (createdRole == null) return BadRequest(new { message = "Failed to create user role" });

                return CreatedAtAction(nameof(GetUserRoleById), new { id = createdRole.RoleId }, createdRole);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Create User Roles", error = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("UserRole/{id}")]
        public async Task<IActionResult> UpdateUserRole(int id, string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name)) return BadRequest(new { message = "Name required!" });
                var existingRole = await _rolesService.GetUserRoleByIdAsync(id);
                if (existingRole == null) return NotFound(new { message = $"User role with ID {id} not found" });
                existingRole.RoleName = name;
                var updateResult = await _rolesService.UpdateUserRoleAsync(MappingHandle.DTOToEntity(existingRole)!);
                if (!updateResult) return BadRequest( new { message = "Failed to update user role" });
                
                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to update user role", ex.Message });

            }

        }
        [HttpDelete("UserRole/{id}")]
        public async Task<IActionResult> DeleteUserRoleById(int id)
        {
            try
            {
                var existingRole = await _rolesService.GetUserRoleByIdAsync(id);
                if (existingRole == null) return NotFound(new { message = $"User role with ID {id} not found" });
                var deleteResult = await _rolesService.DeleteUserRoleByIdAsync(id);
                if (!deleteResult) return BadRequest(new { message = "Failed to delete user role" });
                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to delete user role", error = ex.Message });
            }
        }
        #endregion

        #region RescueMembersRoles
        [HttpGet("RescueMemberRole")]
        public async Task<IActionResult> GetAllRescueMembersRoles()
        {
            try
            {
                return Ok(await _rolesService.GetAllRescueMembersRolesAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Get All Rescue Members Roles", error = ex.Message });

            }
        }

        [HttpGet("RescueMemberRole/{id}")]
        public async Task<IActionResult> GetRescueMembersRoleById(int id)
        {
            try
            {
                return Ok(await _rolesService.GetRescueMembersRoleByIdAsync(id));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Get Rescue Member User Roles", error = ex.Message });

            }
        }

        [HttpPost("RescueMemberRole")]
        public async Task<IActionResult> CreateRescueMembersRole(RescueMembersRoleDTO model)
        {
            try
            {
                var existingRole = await _rolesService.GetRescueMembersRoleByIdAsync(model.RescueMembersRoleId);
                if (existingRole != null) return BadRequest(new { message = $"Rescuemember role with ID {model.RescueMembersRoleId} already exists" });
                var createdRole = await _rolesService.CreateRescueMembersRoleAsync(model.RescueMembersRoleId, model.RoleName);

                if (createdRole == null) return BadRequest(new { message = "Failed to create user role" });

                return CreatedAtAction(nameof(GetRescueMembersRoleById), new { id = createdRole.RescueMembersRoleId }, createdRole);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error Create Rescue Members Role", error = ex.Message });
            }

        }

        [HttpPut("RescueMemberRole/{id}")]
        public async Task<IActionResult> UpdateRescueMembersRole(int id, string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name)) return BadRequest(new { message = "Name required!" });
                var existingRole = await _rolesService.GetRescueMembersRoleByIdAsync(id);
                if (existingRole == null) return NotFound(new { message = $"Rescue members role with ID {id} not found" });
                existingRole.RoleName = name;
                var updateResult = await _rolesService.UpdateRescueMembersRoleAsync(MappingHandle.DTOToEntity(existingRole)!);
                if (!updateResult) return BadRequest(new { message = "Failed to update user role" });

                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to update Rescue Members Role", ex.Message });

            }
        }

        [HttpDelete("RescueMemberRole/{id}")]

        public async Task<IActionResult> DeleteRescueMembersRoleById(int id)
        {
            try
            {
                var existingRole = await _rolesService.GetRescueMembersRoleByIdAsync(id);
                if (existingRole == null) return NotFound(new { message = $"Rescue members role with ID {id} not found" });
                var deleteResult = await _rolesService.DeleteRescueMembersRoleByIdAsync(id);
                if (!deleteResult) return BadRequest(new { message = "Failed to delete user role" });
                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to delete user role", error = ex.Message });
            }
        }
        #endregion
    }
}

