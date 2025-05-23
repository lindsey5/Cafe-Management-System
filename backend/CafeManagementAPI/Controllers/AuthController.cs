using CafeManagementAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly ApplicationDBContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly AuthService _authService;

        public AuthController(ApplicationDBContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("signup")]
        public async Task<ActionResult> SignUp([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Firstname)) return BadRequest(new { message = "Firstname is required" });
            if (string.IsNullOrEmpty(user.Lastname)) return BadRequest(new { message = "Lastname is required" });
            if (string.IsNullOrEmpty(user.Username)) return BadRequest(new { message = "Username is required" });
            if (string.IsNullOrEmpty(user.Password)) return BadRequest(new { message = "Password is required" });
            if (string.IsNullOrEmpty(user.Password)) return BadRequest(new { message = "Role is required" });

            var isUsernameExist = await _context.Users.AnyAsync(u => u.Username == user.Username && u.Status == "Active");
            if (isUsernameExist) return BadRequest(new { message = "Username already exists." });

            user.Password = _passwordHasher.HashPassword(user, user.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _authService.GenerateJwtToken(user);

            return Ok(new { success = true, user, token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginUser.Username && u.Role == loginUser.Role && u.Status == "Active");
            if (user == null) return Unauthorized(new { success = false, message = "Username doesn't exist" });

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, loginUser.Password);
            if (result == PasswordVerificationResult.Failed) return Unauthorized(new { success = false, message = "Incorrect username or password." });

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                success = true,
                message = "Login successful.",
                role = user.Role,
                token
            });
        }
    }
}
