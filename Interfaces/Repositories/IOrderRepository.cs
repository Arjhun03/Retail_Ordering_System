using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order> PlaceOrderAsync(
        int userId,
        string deliveryAddress,
        string orderNumber,
        CancellationToken ct = default);

    Task<PagedResponse<OrderListItemResponse>> GetPageForUserAsync(
        int userId,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<Order?> GetByIdAsync(
        int orderId,
        CancellationToken ct = default);

    Task UpdateStatusAsync(
        Order order,
        CancellationToken ct = default);
}