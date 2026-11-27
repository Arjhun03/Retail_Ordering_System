using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api;

public sealed record RegisterRequest(
    [property: Required, StringLength(100, MinimumLength = 1)] string FullName,
    [property: Required, EmailAddress, StringLength(150)] string Email,
    [property: StringLength(15)] string? Phone,
    [property: Required, StringLength(100, MinimumLength = 8)] string Password);

public sealed record LoginRequest(
    [property: Required] string Email,
    [property: Required] string Password);

public sealed record UserSummaryDto(
    int UserId,
    string FullName,
    string Email,
    string Role);

public sealed record AuthResponse(
    string Token,
    DateTime ExpiresAtUtc,
    UserSummaryDto User);
