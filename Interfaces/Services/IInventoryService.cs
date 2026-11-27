using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface IInventoryService
{
    Task<IReadOnlyList<InventoryResponse>> GetAllAsync(CancellationToken ct = default);
    Task<InventoryResponse> GetByPackagingIdAsync(int packagingId, CancellationToken ct = default);
    Task<InventoryResponse> SetAsync(int packagingId, SetInventoryRequest request, CancellationToken ct = default);
}
