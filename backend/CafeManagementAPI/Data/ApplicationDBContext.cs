using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Item> Items { get; set; } = null!;
    public DbSet<Size> Sizes { get; set; } = null!;
    public DbSet<Sale> Sales { get; set; } = null!;
    public DbSet<Sales_item> Sales_Items { get; set; } = null!;
}