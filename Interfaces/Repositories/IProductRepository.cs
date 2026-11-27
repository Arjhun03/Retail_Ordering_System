
using Retail_Ordering_system.DTOs;
using Retail_Ordering_system.Models;

namespace Retail_Ordering_system.Interfaces.Repositories;

public interface IProductRepository
{
    Task<PagedResponse<ProductListItemResponse>> GetPageAsync(
        int? categoryId,
        int? brandId,
        string? search,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<Product?> GetByIdAsync(
        int id,
        bool includeInactive,
        CancellationToken ct = default);

    Task<Product> AddAsync(
        Product entity,
        CancellationToken ct = default);

    Task UpdateAsync(
        Product entity,
        CancellationToken ct = default);

    Task<bool> BrandAndCategoryExistAsync(
        int brandId,
        int categoryId,
        CancellationToken ct = default);
}
