namespace Retail_Ordering.Api.Models;

public class CartItem
{
    public int CartItemId { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public int PackagingId { get; set; }
    public Packaging Packaging { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }
}