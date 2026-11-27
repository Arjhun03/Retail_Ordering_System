
using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryResponse>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default);

    Task<CategoryResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default);

    Task<CategoryResponse> CreateAsync(
        CreateCategoryRequest request,
        CancellationToken ct = default);

    Task<CategoryResponse> UpdateAsync(
        int id,
        UpdateCategoryRequest request,
        CancellationToken ct = default);

    Task DeactivateAsync(
        int id,
        CancellationToken ct = default);
}
