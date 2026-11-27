using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface IPackagingService
{
    Task<IReadOnlyList<PackagingResponse>> GetByProductIdAsync(
        int productId,
        CancellationToken ct = default);

    Task<PackagingResponse> CreateAsync(
        CreatePackagingRequest request,
        CancellationToken ct = default);

    Task<PackagingResponse> UpdateAsync(
        int id,
        UpdatePackagingRequest request,
        CancellationToken ct = default);

    Task DeactivateAsync(
        int id,
        CancellationToken ct = default);
}