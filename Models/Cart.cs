namespace Retail_Ordering.Api.Models;

public class Cart
{
    public int CartId { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public CartStatus CartStatus { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}