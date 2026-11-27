using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Models;
using Retail_Ordering.Api.Data;

namespace Retail_Ordering.Api.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly RetailDbContext _context;

    public OrderRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<Order> PlaceOrderAsync(
        int userId,
        string deliveryAddress,
        string orderNumber,
        CancellationToken ct = default)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync(ct);

        try
        {
            // 1. Load the customer's active cart
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Packaging)
                        .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(
                    c => c.UserId == userId &&
                         c.CartStatus == CartStatus.Active,
                    ct);

            if (cart == null || cart.Items.Count == 0)
            {
                throw new InvalidOperationException(
                    "Your cart is empty.");
            }

            // 2. Validate cart contents
            foreach (var item in cart.Items)
            {
                if (item.Quantity <= 0)
                {
                    throw new InvalidOperationException(
                        "Cart contains an invalid quantity.");
                }

                if (!item.Packaging.IsActive ||
                    !item.Packaging.Product.IsActive)
                {
                    throw new InvalidOperationException(
                        $"'{item.Packaging.PackagingName}' is no longer available.");
                }
            }

            // 3. Create the order using server-calculated prices
            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                DeliveryAddress = deliveryAddress,
                OrderStatus = OrderStatus.Pending,
                OrderedAt = DateTime.UtcNow,
                TotalAmount = 0
            };

            // 4. Deduct stock and create order item snapshots
            foreach (var cartItem in cart.Items)
            {
                var packaging = cartItem.Packaging;

                // Conditional stock deduction.
                // Stock is reduced only if sufficient quantity exists.
                var affectedRows = await _context.Inventories
                    .Where(i =>
                        i.PackagingId == cartItem.PackagingId &&
                        i.StockQuantity >= cartItem.Quantity)
                    .ExecuteUpdateAsync(
                        updates => updates
                            .SetProperty(
                                i => i.StockQuantity,
                                i => i.StockQuantity - cartItem.Quantity)
                            .SetProperty(
                                i => i.UpdatedAt,
                                DateTime.UtcNow),
                        ct);

                if (affectedRows == 0)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock for '{packaging.PackagingName}'.");
                }

                // Use the current server-side packaging price
                var unitPrice = packaging.Price;

                var subtotal = Math.Round(
                    unitPrice * cartItem.Quantity,
                    2,
                    MidpointRounding.AwayFromZero);

                var orderItem = new OrderItem
                {
                    PackagingId = cartItem.PackagingId,
                    ProductName = packaging.Product.ProductName,
                    PackagingName = packaging.PackagingName,
                    Quantity = cartItem.Quantity,
                    UnitPrice = unitPrice,
                    Subtotal = subtotal
                };

                order.Items.Add(orderItem);

                order.TotalAmount += subtotal;
            }

            // 5. Mark cart as checked out
            cart.CartStatus = CartStatus.CheckedOut;

            // 6. Persist order and cart changes
            await _context.Orders.AddAsync(order, ct);

            await _context.SaveChangesAsync(ct);

            // 7. Commit all stock, order and cart changes
            await transaction.CommitAsync(ct);

            return order;
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    public async Task<PagedResponse<OrderListItemResponse>>
        GetPageForUserAsync(
            int userId,
            int page,
            int pageSize,
            CancellationToken ct = default)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(o => o.OrderedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderListItemResponse(
                o.OrderId,
                o.OrderNumber,
                o.TotalAmount,
                o.OrderStatus.ToString(),
                o.OrderedAt))
            .ToListAsync(ct);

        var totalPages = totalCount == 0
            ? 0
            : (int)Math.Ceiling((double)totalCount / pageSize);

        return new PagedResponse<OrderListItemResponse>(
            items,
            page,
            pageSize,
            totalCount,
            totalPages);
    }

    public async Task<Order?> GetByIdAsync(
        int orderId,
        CancellationToken ct = default)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(
                o => o.OrderId == orderId,
                ct);
    }

    public async Task UpdateStatusAsync(
        Order order,
        CancellationToken ct = default)
    {
        _context.Orders.Update(order);

        await _context.SaveChangesAsync(ct);
    }
}