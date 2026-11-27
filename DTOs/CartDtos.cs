namespace Retail_Ordering.Api.DTOs;

public sealed record AddCartItemRequest(
    int PackagingId,
    int Quantity);

public sealed record UpdateCartItemRequest(
    int Quantity);

public sealed record CartItemResponse(
    int CartItemId,
    int PackagingId,
    string ProductName,
    string PackagingName,
    string Unit,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal);

public sealed record CartResponse(
    int CartId,
    string Status,
    IReadOnlyList<CartItemResponse> Items,
    decimal TotalAmount,
    DateTime CreatedAtUtc);