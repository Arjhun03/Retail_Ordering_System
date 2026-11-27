using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api.DTOs;

public sealed record CreateCategoryRequest(
    [Required]
    [MaxLength(100)]
    string CategoryName,

    [MaxLength(500)]
    string? Description
);

public sealed record UpdateCategoryRequest(
    [Required]
    [MaxLength(100)]
    string CategoryName,

    [MaxLength(500)]
    string? Description,

    bool IsActive
);

public sealed record CategoryResponse(
    int CategoryId,
    string CategoryName,
    string? Description,
    bool IsActive
);
