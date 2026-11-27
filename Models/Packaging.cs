using Retail_Ordering.Api.Enums;

namespace Retail_Ordering.Api.Models;

public class Packaging
{
    public int PackagingId { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string PackagingName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Unit { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public Inventory? Inventory { get; set; }

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}