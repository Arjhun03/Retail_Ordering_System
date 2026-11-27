using System.ComponentModel.DataAnnotations;

namespace Retail_Ordering.Api;

public sealed record RegisterRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FullName,
    [Required, EmailAddress, StringLength(150)] string Email,
    [StringLength(15)] string? Phone,
    [Required, StringLength(100, MinimumLength = 8)] string Password);

public sealed record LoginRequest(
    [Required] string Email,
    [Required] string Password);

public sealed record UserSummaryDto(
    int UserId,
    string FullName,
    string Email,
    string Role);

public sealed record AuthResponse(
    string Token,
    DateTime ExpiresAtUtc,
    UserSummaryDto User);
