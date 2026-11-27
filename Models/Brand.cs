
using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api.Models;

public class Brand
{
    public int BrandId { get; set; }

    [Required]
    [MaxLength(100)]
    public string BrandName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
