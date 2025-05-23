using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models;

public class Sales_item
{
    public int Id { get; set; }
    public int Sales_id { get; set; }

    [ForeignKey(nameof(Sales_id))]
    public Sale? Sale { get; set; }

    public string Item_name { get; set; } = string.Empty;
    public int Quantity { get; set; }

    public byte[]? Image { get; set; }

    public double Subtotal { get; set; }

    public string Size { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public double Total { get; set; }

}
