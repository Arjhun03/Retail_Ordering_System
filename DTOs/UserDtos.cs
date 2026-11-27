using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api;

public sealed record UserProfileResponse(
    int UserId,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    DateTime CreatedAtUtc,
    int? BrandId = null,
    string? BrandName = null);

public sealed record UpdateUserProfileRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FullName,
    [StringLength(15)] string? Phone);

public sealed record CreateBrandManagerRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FullName,
    [Required, EmailAddress, StringLength(150)] string Email,
    [StringLength(15)] string? Phone,
    [Required, StringLength(100, MinimumLength = 8)] string Password,
    [Required] int BrandId);

public sealed record BrandManagerResponse(
    int UserId,
    string FullName,
    string Email,
    string? Phone,
    int? BrandId,
    string? BrandName,
    DateTime CreatedAtUtc);

