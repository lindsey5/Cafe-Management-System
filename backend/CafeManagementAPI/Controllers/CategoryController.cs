using System.Security.Claims;
using CafeManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CategoryController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> AddCategory(Category category)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var isExist = await _context.Categories.AnyAsync(c => c.Category_name == category.Category_name);

            if (isExist) return Conflict(new { success = false, message = "Category already exists." });

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Category successfulyy added" });

        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetCategories()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var categories = await _context.Categories.ToListAsync();

            return Ok(new { success = true, categories });
        }
        

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { success = false, message = "Category not found"});

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            
            return Ok(new { success = true, message = "Category successfully deleted" });
        }
    }
}
