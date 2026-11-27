using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api;

public sealed record UserProfileResponse(
    int UserId,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    DateTime CreatedAtUtc);

public sealed record UpdateUserProfileRequest(
    [property: Required, StringLength(100, MinimumLength = 1)] string FullName,
    [property: StringLength(15)] string? Phone);
