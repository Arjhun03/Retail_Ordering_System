using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface IInventoryRepository
{
    Task<IReadOnlyList<Inventory>> GetAllAsync(CancellationToken ct = default);
    Task<Inventory?> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default);
    Task<Inventory> GetOrCreateForPackagingAsync(int packagingId, CancellationToken ct = default);
    Task UpdateAsync(Inventory inventory, CancellationToken ct = default);
}
