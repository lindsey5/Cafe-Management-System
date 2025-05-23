using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models;

public class Size
{
    public int Id { get; set; }
    public int Item_id { get; set; }
    public string Size_name { get; set; } = string.Empty;
    public double Price { get; set; }

    [ForeignKey("Item_id")]
    public Item? Item { get; set; }
}
