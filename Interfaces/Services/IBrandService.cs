
using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface IBrandService
{
    Task<IReadOnlyList<BrandResponse>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default);

    Task<BrandResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default);

    Task<BrandResponse> CreateAsync(
        CreateBrandRequest request,
        CancellationToken ct = default);

    Task<BrandResponse> UpdateAsync(
        int id,
        UpdateBrandRequest request,
        CancellationToken ct = default);

    Task DeactivateAsync(
        int id,
        CancellationToken ct = default);
}
