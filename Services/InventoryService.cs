using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering_system.Data;
using Retail_Ordering_system.Models;

namespace Retail_Ordering.Api.Services;

public class InventoryService(IInventoryRepository inventoryRepository, RetailDbContext context) : IInventoryService
{
    public async Task<IReadOnlyList<InventoryResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var inventories = await inventoryRepository.GetAllAsync(ct);
        return inventories.Select(MapToResponse).ToList();
    }

    public async Task<InventoryResponse> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default)
    {
        var inventory = await inventoryRepository.GetByPackagingIdAsync(packagingId, ct);
        if (inventory == null)
        {
            // Verify packaging exists before reporting 404
            var packagingExists = await context.Packagings.AnyAsync(p => p.PackagingId == packagingId, ct);
            if (!packagingExists)
            {
                throw new KeyNotFoundException($"Packaging with ID {packagingId} was not found.");
            }

            // Automatically create inventory record if packaging exists
            inventory = await inventoryRepository.GetOrCreateForPackagingAsync(packagingId, ct);
        }

        return MapToResponse(inventory);
    }

    public async Task<InventoryResponse> SetAsync(int packagingId, SetInventoryRequest request, CancellationToken ct = default)
    {
        if (request.StockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity must be non-negative.");
        }

        if (request.ReorderLevel < 0)
        {
            throw new ArgumentException("Reorder level must be non-negative.");
        }

        var inventory = await inventoryRepository.GetOrCreateForPackagingAsync(packagingId, ct);
        inventory.StockQuantity = request.StockQuantity;
        inventory.ReorderLevel = request.ReorderLevel;
        inventory.UpdatedAt = DateTime.UtcNow;

        await inventoryRepository.UpdateAsync(inventory, ct);

        return MapToResponse(inventory);
    }

    private static InventoryResponse MapToResponse(Inventory inventory)
    {
        return new InventoryResponse(
            InventoryId: inventory.InventoryId,
            PackagingId: inventory.PackagingId,
            ProductName: inventory.Packaging?.Product?.ProductName ?? "Unknown Product",
            PackagingName: inventory.Packaging?.PackagingName ?? "Unknown Packaging",
            StockQuantity: inventory.StockQuantity,
            ReorderLevel: inventory.ReorderLevel,
            IsLowStock: inventory.StockQuantity <= inventory.ReorderLevel,
            UpdatedAtUtc: DateTime.SpecifyKind(inventory.UpdatedAt, DateTimeKind.Utc)
        );
    }
}
