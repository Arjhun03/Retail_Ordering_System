using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api.DTOs;

public sealed record CreateProductRequest(
    int BrandId,
    int CategoryId,

    [Required]
    [MaxLength(150)]
    string ProductName,

    [MaxLength(500)]
    string? Description,

    [MaxLength(500)]
    [Url]
    string? ImageUrl
);

public sealed record UpdateProductRequest(
    int BrandId,
    int CategoryId,

    [Required]
    [MaxLength(150)]
    string ProductName,

    [MaxLength(500)]
    string? Description,

    [MaxLength(500)]
    [Url]
    string? ImageUrl,

    bool IsActive
);

public sealed record ProductListItemResponse(
    int ProductId,
    string ProductName,
    string? Description,
    string? ImageUrl,
    int BrandId,
    string BrandName,
    int CategoryId,
    string CategoryName,
    bool IsActive
);

public sealed record ProductDetailResponse(
    int ProductId,
    string ProductName,
    string? Description,
    string? ImageUrl,
    BrandResponse Brand,
    CategoryResponse Category,
    IReadOnlyList<PackagingResponse> Packagings,
    DateTime CreatedAtUtc
);
