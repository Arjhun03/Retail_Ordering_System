
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface IBrandRepository
{
    Task<IReadOnlyList<Brand>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default);

    Task<Brand?> GetByIdAsync(
        int id,
        CancellationToken ct = default);

    Task<Brand> AddAsync(
        Brand entity,
        CancellationToken ct = default);

    Task UpdateAsync(
        Brand entity,
        CancellationToken ct = default);

    Task<bool> HasProductsAsync(
        int id,
        CancellationToken ct = default);
}
