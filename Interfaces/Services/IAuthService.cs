namespace Retail_Ordering.Api;

public interface IAuthService
{
    Task<UserProfileResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}
