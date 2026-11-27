using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface IOrderService
{
    Task<OrderDetailResponse> PlaceOrderAsync(
        int userId,
        PlaceOrderRequest request,
        CancellationToken ct = default);

    Task<PagedResponse<OrderListItemResponse>> GetMyOrdersAsync(
        int userId,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<OrderDetailResponse> GetByIdAsync(
        int requestingUserId,
        bool isAdmin,
        int orderId,
        CancellationToken ct = default);

    Task<OrderDetailResponse> UpdateStatusAsync(
        int orderId,
        OrderStatus status,
        CancellationToken ct = default);
}