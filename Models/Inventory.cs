namespace Retail_Ordering.Api.Models;

public class Inventory
{
    public int InventoryId { get; set; }
    public int PackagingId { get; set; }                       // unique FK
    public Packaging Packaging { get; set; } = null!;
    public int StockQuantity { get; set; }                     // >= 0
    public int ReorderLevel { get; set; }                      // >= 0
    public DateTime UpdatedAt { get; set; }                    // UTC
}
