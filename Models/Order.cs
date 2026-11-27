using Retail_Ordering.Api;
using Retail_Ordering.Api.Enums;

namespace Retail_Ordering_system.Models;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string OrderNumber { get; set; } = string.Empty;    // required, max 30, unique
    public string DeliveryAddress { get; set; } = string.Empty;// required, max 500
    public decimal TotalAmount { get; set; }                   // SQL decimal(10,2)
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    public DateTime OrderedAt { get; set; }                    // UTC
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
