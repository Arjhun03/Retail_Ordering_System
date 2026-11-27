using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface ICartService
{
    Task<CartResponse> GetAsync(
        int userId,
        CancellationToken ct = default);

    Task<CartResponse> AddItemAsync(
        int userId,
        AddCartItemRequest request,
        CancellationToken ct = default);

    Task<CartResponse> UpdateItemAsync(
        int userId,
        int cartItemId,
        UpdateCartItemRequest request,
        CancellationToken ct = default);

    Task<CartResponse> RemoveItemAsync(
        int userId,
        int cartItemId,
        CancellationToken ct = default);
}