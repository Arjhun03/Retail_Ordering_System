namespace Retail_Ordering_system.Models;

public class OrderItem
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int PackagingId { get; set; }
    public Packaging Packaging { get; set; } = null!;
    public string ProductName { get; set; } = string.Empty;   // order-time snapshot, max 150
    public string PackagingName { get; set; } = string.Empty; // order-time snapshot, max 50
    public int Quantity { get; set; }                          // > 0
    public decimal UnitPrice { get; set; }                     // order-time snapshot
    public decimal Subtotal { get; set; }                      // Quantity * UnitPrice
}
