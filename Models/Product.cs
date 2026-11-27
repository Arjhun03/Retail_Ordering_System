
using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering_system.Models;

public class Product
{
    public int ProductId { get; set; }

    public int BrandId { get; set; }

    public Brand Brand { get; set; } = null!;

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    [Required]
    [MaxLength(150)]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Packaging> Packagings { get; set; } = new List<Packaging>();
}
