using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface IPackagingRepository
{
    Task<IReadOnlyList<Packaging>> GetByProductIdAsync(
        int productId,
        bool includeInactive,
        CancellationToken ct = default);

    Task<Packaging?> GetByIdAsync(
        int id,
        bool includeInactive,
        CancellationToken ct = default);

    Task<Packaging> AddAsync(
        Packaging entity,
        CancellationToken ct = default);

    Task UpdateAsync(
        Packaging entity,
        CancellationToken ct = default);
}