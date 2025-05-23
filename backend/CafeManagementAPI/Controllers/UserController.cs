using System.Security.Claims;
using CafeManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly PasswordHasher<User> _passwordHasher = new PasswordHasher<User>();

        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetProfile()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            return Ok(new
            {
                success = true,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    firstname = user.Firstname,
                    lastname = user.Lastname,
                    role = user.Role,
                    image = user.Image
                }
            });
        }

        [Authorize]
        [HttpGet("cashier")]
        public async Task<IActionResult> GetCashiers()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var cashiers = await _context.Users.Where(u => u.Role == "Cashier" && u.Status == "Active").ToListAsync();

            return Ok(new { success = true, cashiers });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var userToDelete = await _context.Users.FindAsync(id);

            if (userToDelete == null) return NotFound(new { success = false, message = "User you want to delete is not found" });

            userToDelete.Status = "Deleted";

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "User successfully deleted" });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate == null) return NotFound(new { success = false, message = "The user that you want to update not found" });

            var isUsernameExist = await _context.Users.AnyAsync(u => u.Username == updatedUser.Username && u.Id != updatedUser.Id);
            if (isUsernameExist) return BadRequest(new { message = "Username already exists." });

            userToUpdate.Username = updatedUser.Username;
            userToUpdate.Firstname = updatedUser.Firstname;
            userToUpdate.Lastname = updatedUser.Lastname;
            userToUpdate.Image = updatedUser.Image;

            if(!string.IsNullOrEmpty(updatedUser.Password)) userToUpdate.Password = _passwordHasher.HashPassword(userToUpdate, updatedUser.Password);
            
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "User successfully deleted" });
        }
        
        [Authorize]
        [HttpGet("total")]
        public async Task<IActionResult> GetTotalItems(string role = "Cashier")
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var total = await _context.Users
                .Where(i => i.Status != "Deleted" && i.Role == role)
                .CountAsync();

            return Ok(new { success = true, total });
        }
    }
}
