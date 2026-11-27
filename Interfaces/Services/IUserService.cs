namespace Retail_Ordering.Api;

public interface IUserService
{
    Task<UserProfileResponse> GetMeAsync(int userId, CancellationToken ct = default);
    Task<UserProfileResponse> UpdateMeAsync(int userId, UpdateUserProfileRequest request, CancellationToken ct = default);
}
