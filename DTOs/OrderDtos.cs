using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.DTOs;

public sealed record PlaceOrderRequest(
    string DeliveryAddress);

public sealed record UpdateOrderStatusRequest(
    OrderStatus Status);

public sealed record OrderListItemResponse(
    int OrderId,
    string OrderNumber,
    decimal TotalAmount,
    string Status,
    DateTime OrderedAtUtc);

public sealed record OrderItemResponse(
    int OrderItemId,
    int PackagingId,
    string ProductName,
    string PackagingName,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal);

public sealed record OrderDetailResponse(
    int OrderId,
    string OrderNumber,
    int UserId,
    string DeliveryAddress,
    decimal TotalAmount,
    string Status,
    DateTime OrderedAtUtc,
    IReadOnlyList<OrderItemResponse> Items);