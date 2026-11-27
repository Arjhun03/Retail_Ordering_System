namespace Retail_Ordering.Api.Models;

public class OrderItem
{
    public int OrderItemId { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int PackagingId { get; set; }
    public Packaging Packaging { get; set; } = null!;

    public string ProductName { get; set; } = string.Empty;

    public string PackagingName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal Subtotal { get; set; }
}