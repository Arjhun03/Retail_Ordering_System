using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Repositories;

public class CartRepository : ICartRepository
{
    private readonly RetailDbContext _context;

    public CartRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<Cart> GetOrCreateActiveAsync(
        int userId,
        CancellationToken ct = default)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Packaging)
                    .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(
                c => c.UserId == userId &&
                     c.CartStatus == CartStatus.Active,
                ct);

        if (cart != null)
        {
            foreach (var item in cart.Items)
            {
                if (item.Packaging == null)
                {
                    await _context.Entry(item)
                        .Reference(i => i.Packaging)
                        .Query()
                        .Include(p => p.Product)
                        .LoadAsync(ct);
                }
                else if (item.Packaging.Product == null)
                {
                    await _context.Entry(item.Packaging)
                        .Reference(p => p.Product)
                        .LoadAsync(ct);
                }
            }
            return cart;
        }

        cart = new Cart
        {
            UserId = userId,
            CartStatus = CartStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Carts.AddAsync(cart, ct);
        await _context.SaveChangesAsync(ct);

        return cart;
    }

    public async Task<CartItem?> GetItemAsync(
        int userId,
        int cartItemId,
        CancellationToken ct = default)
    {
        return await _context.CartItems
            .Include(i => i.Packaging)
                .ThenInclude(p => p.Product)
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(
                i => i.CartItemId == cartItemId &&
                     i.Cart.UserId == userId &&
                     i.Cart.CartStatus == CartStatus.Active,
                ct);
    }

    public async Task<CartItem?> GetItemByPackagingAsync(
        int cartId,
        int packagingId,
        CancellationToken ct = default)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(
                i => i.CartId == cartId &&
                     i.PackagingId == packagingId,
                ct);
    }

    public async Task<CartItem> AddItemAsync(
        CartItem item,
        CancellationToken ct = default)
    {
        await _context.CartItems.AddAsync(item, ct);
        await _context.SaveChangesAsync(ct);

        return item;
    }

    public async Task UpdateItemAsync(
        CartItem item,
        CancellationToken ct = default)
    {
        _context.CartItems.Update(item);
        await _context.SaveChangesAsync(ct);
    }

    public async Task RemoveItemAsync(
        CartItem item,
        CancellationToken ct = default)
    {
        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync(ct);
    }
}