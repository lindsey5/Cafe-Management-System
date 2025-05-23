using System;
using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Models;

public class User
{
    public int Id { get; set; }
    [MaxLength(20, ErrorMessage = "Username cannot exceed 20 characters.")]
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters.")]
    public string Firstname { get; set; } = string.Empty;
    
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters.")]
    public string Lastname { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateTime Created_at { get; set; } = DateTime.Now;
    public byte[]? Image { get; set; }
}
