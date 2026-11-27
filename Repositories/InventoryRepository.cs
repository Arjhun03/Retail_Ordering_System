using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Data;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Repositories;

public class InventoryRepository(RetailDbContext context) : IInventoryRepository
{
    public async Task<IReadOnlyList<Inventory>> GetAllAsync(CancellationToken ct = default)
    {
        return await context.Inventories
            .Include(i => i.Packaging)
                .ThenInclude(p => p.Product)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<Inventory?> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default)
    {
        return await context.Inventories
            .Include(i => i.Packaging)
                .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(i => i.PackagingId == packagingId, ct);
    }

    public async Task<Inventory> GetOrCreateForPackagingAsync(int packagingId, CancellationToken ct = default)
    {
        var inventory = await context.Inventories
            .Include(i => i.Packaging)
                .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(i => i.PackagingId == packagingId, ct);

        if (inventory != null)
        {
            return inventory;
        }

        var packaging = await context.Packagings
            .Include(p => p.Product)
            .FirstOrDefaultAsync(p => p.PackagingId == packagingId, ct)
            ?? throw new KeyNotFoundException($"Packaging with ID {packagingId} was not found.");

        inventory = new Inventory
        {
            PackagingId = packagingId,
            Packaging = packaging,
            StockQuantity = 0,
            ReorderLevel = 0,
            UpdatedAt = DateTime.UtcNow
        };

        await context.Inventories.AddAsync(inventory, ct);
        await context.SaveChangesAsync(ct);

        return inventory;
    }

    public async Task UpdateAsync(Inventory inventory, CancellationToken ct = default)
    {
        context.Inventories.Update(inventory);
        await context.SaveChangesAsync(ct);
    }
}
