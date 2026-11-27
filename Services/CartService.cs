using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IPackagingRepository _packagingRepository;

    public CartService(
        ICartRepository cartRepository,
        IPackagingRepository packagingRepository)
    {
        _cartRepository = cartRepository;
        _packagingRepository = packagingRepository;
    }

    public async Task<CartResponse> GetAsync(
        int userId,
        CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        var cart = await _cartRepository.GetOrCreateActiveAsync(
            userId,
            ct);

        return MapToResponse(cart);
    }

    public async Task<CartResponse> AddItemAsync(
        int userId,
        AddCartItemRequest request,
        CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        ValidateQuantity(request.Quantity);

        if (request.PackagingId <= 0)
        {
            throw new ArgumentException("Invalid packaging ID.");
        }

        // Get or create the customer's active cart
        var cart = await _cartRepository.GetOrCreateActiveAsync(
            userId,
            ct);

        // Retrieve active packaging
        var packaging = await _packagingRepository.GetByIdAsync(
            request.PackagingId,
            includeInactive: false,
            ct);

        if (packaging == null)
        {
            throw new KeyNotFoundException(
                "Packaging not found or inactive.");
        }

        // Check if the same packaging already exists in the cart
        var existingItem =
            await _cartRepository.GetItemByPackagingAsync(
                cart.CartId,
                request.PackagingId,
                ct);

        if (existingItem != null)
        {
            var newQuantity = existingItem.Quantity + request.Quantity;

            if (newQuantity > 100)
            {
                throw new ArgumentException(
                    "Cart item quantity cannot exceed 100.");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UnitPrice = packaging.Price;

            await _cartRepository.UpdateItemAsync(
                existingItem,
                ct);
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.CartId,
                PackagingId = packaging.PackagingId,
                Packaging = packaging,
                Quantity = request.Quantity,
                UnitPrice = packaging.Price
            };

            await _cartRepository.AddItemAsync(
                cartItem,
                ct);
        }

        // Retrieve the updated cart
        var updatedCart = await _cartRepository.GetOrCreateActiveAsync(
            userId,
            ct);

        return MapToResponse(updatedCart);
    }

    public async Task<CartResponse> UpdateItemAsync(
        int userId,
        int cartItemId,
        UpdateCartItemRequest request,
        CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        if (cartItemId <= 0)
        {
            throw new ArgumentException("Invalid cart item ID.");
        }

        ValidateQuantity(request.Quantity);

        var cartItem = await _cartRepository.GetItemAsync(
            userId,
            cartItemId,
            ct);

        if (cartItem == null)
        {
            throw new KeyNotFoundException(
                "Cart item not found.");
        }

        // Retrieve current packaging price
        var packaging = await _packagingRepository.GetByIdAsync(
            cartItem.PackagingId,
            includeInactive: false,
            ct);

        if (packaging == null)
        {
            throw new KeyNotFoundException(
                "Packaging is no longer available.");
        }

        cartItem.Quantity = request.Quantity;
        cartItem.UnitPrice = packaging.Price;

        await _cartRepository.UpdateItemAsync(
            cartItem,
            ct);

        var updatedCart = await _cartRepository.GetOrCreateActiveAsync(
            userId,
            ct);

        return MapToResponse(updatedCart);
    }

    public async Task<CartResponse> RemoveItemAsync(
        int userId,
        int cartItemId,
        CancellationToken ct = default)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }

        if (cartItemId <= 0)
        {
            throw new ArgumentException("Invalid cart item ID.");
        }

        var cartItem = await _cartRepository.GetItemAsync(
            userId,
            cartItemId,
            ct);

        if (cartItem == null)
        {
            throw new KeyNotFoundException(
                "Cart item not found.");
        }

        await _cartRepository.RemoveItemAsync(
            cartItem,
            ct);

        var updatedCart = await _cartRepository.GetOrCreateActiveAsync(
            userId,
            ct);

        return MapToResponse(updatedCart);
    }

    private static void ValidateQuantity(int quantity)
    {
        if (quantity < 1 || quantity > 100)
        {
            throw new ArgumentException(
                "Quantity must be between 1 and 100.");
        }
    }

    private static CartResponse MapToResponse(Cart cart)
    {
        var items = cart.Items
            .Where(item => item != null)
            .Select(item => new CartItemResponse(
                item.CartItemId,
                item.PackagingId,
                item.Packaging?.Product?.ProductName ?? "Product",
                item.Packaging?.PackagingName ?? "Standard",
                item.Packaging?.Unit ?? "1 Unit",
                item.Quantity,
                item.UnitPrice,
                Math.Round(
                    item.UnitPrice * item.Quantity,
                    2,
                    MidpointRounding.AwayFromZero)))
            .ToList();

        var total = Math.Round(
            items.Sum(item => item.Subtotal),
            2,
            MidpointRounding.AwayFromZero);

        return new CartResponse(
            cart.CartId,
            cart.CartStatus.ToString(),
            items,
            total,
            cart.CreatedAt);
    }
}