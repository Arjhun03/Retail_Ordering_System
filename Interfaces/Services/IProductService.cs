
using Retail_Ordering.Api.DTOs;

namespace Retail_Ordering.Api.Interfaces.Services;

public interface IProductService
{
    Task<PagedResponse<ProductListItemResponse>> GetPageAsync(
        int? categoryId,
        int? brandId,
        string? search,
        int page,
        int pageSize,
        CancellationToken ct = default);

    Task<ProductDetailResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default);

    Task<ProductDetailResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken ct = default);

    Task<ProductDetailResponse> UpdateAsync(
        int id,
        UpdateProductRequest request,
        CancellationToken ct = default);

    Task DeactivateAsync(
        int id,
        CancellationToken ct = default);
}
