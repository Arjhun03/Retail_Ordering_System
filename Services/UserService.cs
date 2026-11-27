namespace Retail_Ordering.Api;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserProfileResponse> GetMeAsync(int userId, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new KeyNotFoundException("User not found.");

        return MapToProfileResponse(user);
    }

    public async Task<UserProfileResponse> UpdateMeAsync(
        int userId,
        UpdateUserProfileRequest request,
        CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, ct)
            ?? throw new KeyNotFoundException("User not found.");

        user.FullName = request.FullName.Trim();
        user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

        await _userRepository.UpdateAsync(user, ct);
        return MapToProfileResponse(user);
    }

    private static UserProfileResponse MapToProfileResponse(User user) =>
        new(user.UserId, user.FullName, user.Email, user.Phone, user.Role.ToString(), user.CreatedAt);
}
