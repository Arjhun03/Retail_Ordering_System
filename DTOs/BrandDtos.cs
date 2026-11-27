using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api.DTOs;

public sealed record CreateBrandRequest(
    [Required]
    [MaxLength(100)]
    string BrandName,

    [MaxLength(500)]
    string? Description
);

public sealed record UpdateBrandRequest(
    [Required]
    [MaxLength(100)]
    string BrandName,

    [MaxLength(500)]
    string? Description,

    bool IsActive
);

public sealed record BrandResponse(
    int BrandId,
    string BrandName,
    string? Description,
    bool IsActive
);
