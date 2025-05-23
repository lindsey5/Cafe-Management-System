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
    public class SaleController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public SaleController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> AddSale(Sale sale)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            sale.Cashier_id = userId;
            _context.Sales.Add(sale);
            Console.Write(sale.Sales);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, sales = sale });
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetSales(int page = 1, int limit = 50, string searchTerm = "")
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            int? parsedId = null;
            if (int.TryParse(searchTerm, out int id))
            {
                parsedId = id;
            }

            string lowerSearch = searchTerm?.ToLower() ?? "";

            var sales = await _context.Sales
                .Include(s => s.Sales_items)
                .Include(s => s.Cashier)
                .Where(s => s.Cashier != null &&
                    (
                        (parsedId.HasValue && s.Id == parsedId.Value) ||
                        string.IsNullOrEmpty(lowerSearch) ||
                        s.Cashier.Firstname.ToLower().Contains(lowerSearch) ||
                        s.Cashier.Lastname.ToLower().Contains(lowerSearch)
                    ))
                .OrderByDescending(s => s.Date_time)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var total = await _context.Sales.CountAsync();


            return Ok(new
            {
                success = true,
                page,
                limit,
                totalPages = (int)Math.Ceiling((double)total / limit),
                total,
                sales,
            });

        }

        [Authorize]
        [HttpGet("cashier")]
        public async Task<IActionResult> GetCashierSales(int page = 1, int limit = 50, DateTime? start_date = null, DateTime? end_date = null)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var query = _context.Sales
                .Include(s => s.Sales_items)
                .Include(s => s.Cashier)
                .Where(s => s.Cashier_id == userId);

            if (start_date.HasValue)
                query = query.Where(s => s.Date_time.Date >= start_date.Value);

            if (end_date.HasValue)
                query = query.Where(s => s.Date_time.Date <= end_date.Value);

            var sales = await query
                .OrderByDescending(s => s.Date_time)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var total = await query.CountAsync();

            return Ok(new
            {
                success = true,
                page,
                limit,
                totalPages = (int)Math.Ceiling((double)total / limit),
                total,
                sales,
            });

        }

        [Authorize]
        [HttpGet("month")]
        public async Task<IActionResult> GetMonthlySales([FromQuery] int? year)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });


            int targetYear = year ?? DateTime.Now.Year;

            double[] salesArray = new double[12];

            var monthlySales = await _context.Sales
                .Where(s => s.Date_time.Year == targetYear)
                .GroupBy(s => s.Date_time.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Total = g.Sum(s => s.Sales)
                })
                .ToListAsync();

            foreach (var sale in monthlySales)
            {
                salesArray[sale.Month - 1] = sale.Total;
            }

            return Ok(new
            {
                success = true,
                monthlySales,
            });
        }

        [Authorize]
        [HttpGet("cashier/month")]
        public async Task<IActionResult> GetCashierMonthlySales([FromQuery] int? year)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });


            int targetYear = year ?? DateTime.Now.Year;

            double[] salesArray = new double[12];

            var monthlySales = await _context.Sales
                .Where(s => s.Date_time.Year == targetYear && s.Cashier_id == userId)
                .GroupBy(s => s.Date_time.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Total = g.Sum(s => s.Sales)
                })
                .ToListAsync();

            foreach (var sale in monthlySales)
            {
                salesArray[sale.Month - 1] = sale.Total;
            }

            return Ok(new
            {
                success = true,
                monthlySales,
            });
        }

        [Authorize]
        [HttpGet("today")]
        public async Task<IActionResult> GetTodaySales()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            var today = DateTime.Today;

            double totalSalesToday = await _context.Sales
                .Where(s => s.Date_time.Date == today)
                .SumAsync(s => s.Sales);

            return Ok(new
            {
                success = true,
                total = totalSalesToday
            });
        }

        [Authorize]
        [HttpGet("cashier/today")]
        public async Task<IActionResult> GetCashierTodaySales()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            var today = DateTime.Today;

            double totalSalesToday = await _context.Sales
                .Where(s => s.Date_time.Date == today && s.Cashier != null && s.Cashier_id == userId)
                .SumAsync(s => s.Sales);

            return Ok(new
            {
                success = true,
                total = totalSalesToday
            });
        }


        [Authorize]
        [HttpGet("year")]
        public async Task<IActionResult> GetTotalSales()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            int currentYear = DateTime.Today.Year;

            double totalSales = await _context.Sales
                .Where(s => s.Date_time.Year == currentYear)
                .SumAsync(s => s.Sales);

            return Ok(new
            {
                success = true,
                total = totalSales
            });
        }
        
        [Authorize]
        [HttpGet("cashier/year")]
        public async Task<IActionResult> GetCashierTotalSales()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "User not found." });

            int currentYear = DateTime.Today.Year;

            double totalSales = await _context.Sales
                .Where(s => s.Date_time.Year == currentYear && s.Cashier_id == userId)
                .SumAsync(s => s.Sales);

            return Ok(new
            {
                success = true,
                total = totalSales
            });
        }


    }
}
