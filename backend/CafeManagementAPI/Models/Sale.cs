using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models;

public class Sale
{
    public int Id { get; set; }
    public int Cashier_id { get; set; }
    public double Subtotal { get; set; }
    public double Tax { get; set; }
    public double Sales { get; set; }
    public DateTime Date_time { get; set; } = DateTime.Now;

    [ForeignKey(nameof(Cashier_id))]
    public User? Cashier { get; set; }
    public ICollection<Sales_item> Sales_items { get; set; } = new List<Sales_item>();
}