using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Retail_Ordering.Api;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHelper _passwordHelper;
    private readonly JwtHelper _jwtHelper;

    public AuthService(
        IUserRepository userRepository,
        PasswordHelper passwordHelper,
        JwtHelper jwtHelper)
    {
        _userRepository = userRepository;
        _passwordHelper = passwordHelper;
        _jwtHelper = jwtHelper;
    }

    public async Task<UserProfileResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = NormalizeEmail(request.Email);

        if (await _userRepository.EmailExistsAsync(normalizedEmail, ct))
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Phone = NormalizePhone(request.Phone),
            Role = UserRole.Customer,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _passwordHelper.Hash(user, request.Password);

        try
        {
            await _userRepository.AddAsync(user, ct);
        }
        catch (DbUpdateException)
        {
            if (await _userRepository.EmailExistsAsync(normalizedEmail, ct))
            {
                throw new InvalidOperationException("Email is already registered.");
            }

            throw;
        }

        return MapToProfileResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        var user = await _userRepository.GetByEmailAsync(normalizedEmail, ct);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var verificationResult = _passwordHelper.Verify(user, user.PasswordHash, request.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHelper.Hash(user, request.Password);
            await _userRepository.UpdateAsync(user, ct);
        }

        var (token, expiresAtUtc) = _jwtHelper.GenerateToken(user);
        return new AuthResponse(token, expiresAtUtc, MapToSummaryDto(user));
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static string? NormalizePhone(string? phone) =>
        string.IsNullOrWhiteSpace(phone) ? null : phone.Trim();

    private static UserProfileResponse MapToProfileResponse(User user) =>
        new(user.UserId, user.FullName, user.Email, user.Phone, user.Role.ToString(), user.CreatedAt);

    private static UserSummaryDto MapToSummaryDto(User user) =>
        new(user.UserId, user.FullName, user.Email, user.Role.ToString());
}
