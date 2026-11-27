using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Helpers;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDetailResponse> PlaceOrderAsync(
        int userId,
        PlaceOrderRequest request,
        CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        if (string.IsNullOrWhiteSpace(request.DeliveryAddress))
        {
            throw new ArgumentException(
                "Delivery address is required.");
        }

        var address = request.DeliveryAddress.Trim();

        if (address.Length > 500)
        {
            throw new ArgumentException(
                "Delivery address cannot exceed 500 characters.");
        }

        var orderNumber = OrderNumberHelper.GenerateOrderNumber();

        var order = await _orderRepository.PlaceOrderAsync(
            userId,
            address,
            orderNumber,
            ct);

        return MapToDetailResponse(order);
    }

    public async Task<PagedResponse<OrderListItemResponse>>
        GetMyOrdersAsync(
            int userId,
            int page,
            int pageSize,
            CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        if (page < 1)
        {
            throw new ArgumentException(
                "Page number must be at least 1.");
        }

        if (pageSize < 1 || pageSize > 50)
        {
            throw new ArgumentException(
                "Page size must be between 1 and 50.");
        }

        return await _orderRepository.GetPageForUserAsync(
            userId,
            page,
            pageSize,
            ct);
    }

    public async Task<OrderDetailResponse> GetByIdAsync(
        int requestingUserId,
        bool isAdmin,
        int orderId,
        CancellationToken ct = default)
    {
        if (requestingUserId <= 0)
        {
            throw new ArgumentException(
                "Invalid user ID.");
        }

        if (orderId <= 0)
        {
            throw new ArgumentException(
                "Invalid order ID.");
        }

        var order = await _orderRepository.GetByIdAsync(
            orderId,
            ct);

        if (order == null)
        {
            throw new KeyNotFoundException(
                "Order not found.");
        }

        // Customers can only access their own orders.
        // Admins can access any order.
        if (!isAdmin && order.UserId != requestingUserId)
        {
            throw new UnauthorizedAccessException(
                "You are not authorized to view this order.");
        }

        return MapToDetailResponse(order);
    }

    public async Task<OrderDetailResponse> UpdateStatusAsync(
        int orderId,
        OrderStatus status,
        CancellationToken ct = default)
    {
        if (orderId <= 0)
        {
            throw new ArgumentException(
                "Invalid order ID.");
        }

        var order = await _orderRepository.GetByIdAsync(
            orderId,
            ct);

        if (order == null)
        {
            throw new KeyNotFoundException(
                "Order not found.");
        }

        if (!IsValidTransition(order.OrderStatus, status))
        {
            throw new InvalidOperationException(
                $"Cannot change order status from " +
                $"{order.OrderStatus} to {status}.");
        }

        order.OrderStatus = status;

        await _orderRepository.UpdateStatusAsync(
            order,
            ct);

        var updatedOrder = await _orderRepository.GetByIdAsync(
            orderId,
            ct);

        if (updatedOrder == null)
        {
            throw new InvalidOperationException(
                "Unable to retrieve updated order.");
        }

        return MapToDetailResponse(updatedOrder);
    }

    private static bool IsValidTransition(
        OrderStatus current,
        OrderStatus next)
    {
        return current switch
        {
            OrderStatus.Pending =>
                next == OrderStatus.Confirmed ||
                next == OrderStatus.Cancelled,

            OrderStatus.Confirmed =>
                next == OrderStatus.Preparing ||
                next == OrderStatus.Cancelled,

            OrderStatus.Preparing =>
                next == OrderStatus.Ready,

            OrderStatus.Ready =>
                next == OrderStatus.Delivered,

            OrderStatus.Delivered => false,

            OrderStatus.Cancelled => false,

            _ => false
        };
    }

    private static OrderDetailResponse MapToDetailResponse(
        Order order)
    {
        var items = order.Items
            .Select(item => new OrderItemResponse(
                item.OrderItemId,
                item.PackagingId,
                item.ProductName,
                item.PackagingName,
                item.Quantity,
                item.UnitPrice,
                item.Subtotal))
            .ToList();

        return new OrderDetailResponse(
            order.OrderId,
            order.OrderNumber,
            order.UserId,
            order.DeliveryAddress,
            order.TotalAmount,
            order.OrderStatus.ToString(),
            order.OrderedAt,
            items);
    }
}