using Retail_Ordering.Api;
namespace Retail_Ordering.Api.Models;

public class Order
{
    public int OrderId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string OrderNumber { get; set; } = string.Empty;

    public string DeliveryAddress { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public OrderStatus OrderStatus { get; set; }

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}