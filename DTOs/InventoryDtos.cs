namespace Retail_Ordering.Api.DTOs;

public sealed record SetInventoryRequest(int StockQuantity, int ReorderLevel);

public sealed record AdjustInventoryRequest(int Adjustment, string Reason);

public sealed record InventoryResponse(
    int InventoryId,
    int PackagingId,
    string ProductName,
    string PackagingName,
    int StockQuantity,
    int ReorderLevel,
    bool IsLowStock,
    DateTime UpdatedAtUtc);
