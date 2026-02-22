using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Models.UserModel;
using Services.Interface;
using DTOs.Overlut;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(GetAllUserModel model)
        {
            try
            {
                var users = await _userService.GetAllUserAsync(
                    model.userId, 
                    model.roleId, 
                    model.fullName, 
                    model.identifyId, 
                    model.address, 
                    model.email, 
                    model.phone
                );
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsersById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUsersByEmail(string email)
        {
            try
            {
                var user = await _userService.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return NotFound($"User with email {email} not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(UpdateUserModel model)
        {
            try
            {

                var existingUser = await _userService.GetUserByIdAsync(model.UserId);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {model.UserId} not found.");
                }
                
                if (model.FullName != null) existingUser.FullName = model.FullName;
                if (model.IdentifyId != null) existingUser.IdentifyId = model.IdentifyId;
                if (model.Address != null) existingUser.Address = model.Address;
                if (model.Phone != null) existingUser.Phone = model.Phone;
                if (model.Password != null) existingUser.Password = model.Password;

                var result = await _userService.UpdateUserProfileAsync(existingUser);
                
                if (result)
                {
                    return Ok("User updated successfully.");
                }
                else
                {
                    return BadRequest("Failed to update user.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("role")]
        public async Task<IActionResult> ChangeUserRole(ChangeUserRoleModel model)
        {
            try
            {
                var result = await _userService.ChangeUserRoleAsync(model.UserId, model.RoleId);
                if (result)
                {
                    return Ok("User role updated successfully.");
                }
                else
                {
                    return BadRequest("Failed to update user role. User might not exist.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserById(int id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (result)
                {
                    return Ok($"User with ID {id} deleted successfully.");
                }
                else
                {
                    return BadRequest($"Failed to delete user with ID {id}. User might not exist.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
