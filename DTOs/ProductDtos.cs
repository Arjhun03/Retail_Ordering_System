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

public sealed record CreateMyBrandProductRequest(
    [Required]
    int CategoryId,

    [Required]
    [MaxLength(150)]
    string ProductName,

    [MaxLength(500)]
    string? Description,

    [Required(ErrorMessage = "Product image URL is required.")]
    [MaxLength(500)]
    [Url(ErrorMessage = "Image URL must be a valid URL.")]
    string ImageUrl,

    [Range(0.01, 10000, ErrorMessage = "Price must be greater than 0.")]
    decimal? Price = null,

    [MaxLength(50)]
    string? Unit = null,

    [MaxLength(100)]
    string? PackagingName = null
);

public sealed record UpdateMyBrandProductRequest(
    [Required]
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

public sealed record ProductPackagingSummary(
    int PackagingId,
    string PackagingName,
    decimal Price,
    string Unit,
    int StockQuantity
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
    bool IsActive,
    decimal? StartingPrice = null,
    int? DefaultPackagingId = null,
    IReadOnlyList<ProductPackagingSummary>? Packagings = null
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
