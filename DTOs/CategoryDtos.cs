
using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering_system.DTOs;

public sealed record CreateCategoryRequest(
    [property: Required]
    [property: MaxLength(100)]
    string CategoryName,

    [property: MaxLength(500)]
    string? Description
);

public sealed record UpdateCategoryRequest(
    [property: Required]
    [property: MaxLength(100)]
    string CategoryName,

    [property: MaxLength(500)]
    string? Description,

    bool IsActive
);

public sealed record CategoryResponse(
    int CategoryId,
    string CategoryName,
    string? Description,
    bool IsActive
);
