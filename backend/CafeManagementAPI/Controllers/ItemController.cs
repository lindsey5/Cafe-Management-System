using System.Security.Claims;
using CafeManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ItemController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> AddItem(Item newItem)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });
            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var item = await _context.Items.FirstOrDefaultAsync(i => i.Name == newItem.Name);
            if (item != null && item.Status == "Available")
                return Conflict(new { success = false, message = "Item already exists." });

            if (item == null)
            {
                _context.Items.Add(newItem);
                item = newItem;
            }
            else item.Status = "Available";

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Item successfully added" });
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetItems()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var items = await _context.Items
                .Where(i => i.Status != "Deleted")
                .Include(i => i.Sizes)
                .Include(i => i.Category)
                .ToListAsync();

            return Ok(new { success = true, items });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(Item updatedItem, int id)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });
            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var item = await _context.Items
                .Include(i => i.Sizes)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null) return NotFound(new { success = false, message = "Item not found" });

            item.Name = updatedItem.Name;
            item.Category_id = updatedItem.Category_id;
            item.Status = updatedItem.Status;
            item.Price = updatedItem.Price;
            item.Image = updatedItem.Image;

            var toUpdate = item.Sizes
                .Where(existing => updatedItem.Sizes.Any(u => u.Size_name == existing.Size_name))
                .ToList();

            foreach (var existing in toUpdate)
            {
                var updated = updatedItem.Sizes.First(u => u.Size_name == existing.Size_name);
                existing.Price = updated.Price;
            }

            var toDelete = item.Sizes
                .Where(existing => !updatedItem.Sizes.Any(u => u.Size_name == existing.Size_name))
                .ToList();

            var toAdd = updatedItem.Sizes
                .Where(u => !item.Sizes.Any(existing => existing.Size_name == u.Size_name))
                .ToList();

            foreach (var sz in toDelete)
            {
                _context.Sizes.Remove(sz);
            }

            foreach (var sz in toAdd)
            {
                sz.Item_id = item.Id;
                _context.Sizes.Add(sz);
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Item successfully added" });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });
            if (user.Role != "Admin") return Unauthorized(new { success = false, message = "Restricted to admin only" });

            var item = await _context.Items.FindAsync(id);
            if (item == null) return NotFound(new { success = false, message = "Item not found" });

            item.Status = "Deleted";
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Item successfully deleted" });
        }

        [Authorize]
        [HttpGet("total")]
        public async Task<IActionResult> GetTotalItems()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var totalItems = await _context.Items
                .Where(i => i.Status != "Deleted")
                .CountAsync();

            return Ok(new { success = true, totalItems });
        }

        [Authorize]
        [HttpGet("top")]
        public async Task<IActionResult> GetTop10ItemsThisYear(int top = 10)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            int currentYear = DateTime.Now.Year;

            var topItems = await _context.Sales_Items
                .Where(si => si.Sale != null && si.Sale.Date_time.Year == currentYear)
                .GroupBy(si => si.Item_name)
                .Select(g => new
                {
                    ItemName = g.Key,
                    TotalQuantity = g.Sum(i => i.Quantity),
                    TotalSales = g.Sum(i => i.Total)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(top)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                topItems
            });
        }
        
        [Authorize]
        [HttpGet("cashier/total")]
        public async Task<IActionResult> CashierTotalProductsSold()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            var month = DateTime.Now.Month;

            var total = await _context.Sales_Items
                .Include(si => si.Sale)
                .Where(si => si.Sale != null && si.Sale.Cashier_id == userId && si.Sale.Date_time.Month== month)
                .CountAsync();

            return Ok(new
            {
                success = true,
                total,
            });
        }
    }
}
