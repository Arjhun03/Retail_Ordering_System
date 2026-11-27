using Retail_Ordering.Api;
using Retail_Ordering.Api.Enums;

namespace Retail_Ordering_system.Models;

public class Cart
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public CartStatus CartStatus { get; set; } = CartStatus.Active;
    public DateTime CreatedAt { get; set; }                    // UTC
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
