using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models;

public class Item
{
    public int Id { get; set; }
    public int Category_id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double? Price { get; set; }
    public string Status { get; set; } = "To Sell";
    public byte[]? Image { get; set; }

    [ForeignKey(nameof(Category_id))]
    public Category? Category { get; set; }
    public ICollection<Size> Sizes { get; set; } = new List<Size>();
}
