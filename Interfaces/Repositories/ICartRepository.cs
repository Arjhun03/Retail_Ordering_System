using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface ICartRepository
{
    Task<Cart> GetOrCreateActiveAsync(
        int userId,
        CancellationToken ct = default);

    Task<CartItem?> GetItemAsync(
        int userId,
        int cartItemId,
        CancellationToken ct = default);

    Task<CartItem?> GetItemByPackagingAsync(
        int cartId,
        int packagingId,
        CancellationToken ct = default);

    Task<CartItem> AddItemAsync(
        CartItem item,
        CancellationToken ct = default);

    Task UpdateItemAsync(
        CartItem item,
        CancellationToken ct = default);

    Task RemoveItemAsync(
        CartItem item,
        CancellationToken ct = default);
}