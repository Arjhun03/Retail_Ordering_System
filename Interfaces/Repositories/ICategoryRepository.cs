
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default);

    Task<Category?> GetByIdAsync(
        int id,
        CancellationToken ct = default);

    Task<Category> AddAsync(
        Category entity,
        CancellationToken ct = default);

    Task UpdateAsync(
        Category entity,
        CancellationToken ct = default);

    Task<bool> HasProductsAsync(
        int id,
        CancellationToken ct = default);
}
