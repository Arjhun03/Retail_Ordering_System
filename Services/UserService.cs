using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Data;

namespace Retail_Ordering.Api;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHelper _passwordHelper;
    private readonly RetailDbContext _db;

    public UserService(
        IUserRepository userRepository,
        PasswordHelper passwordHelper,
        RetailDbContext db)
    {
        _userRepository = userRepository;
        _passwordHelper = passwordHelper;
        _db = db;
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

    public async Task<BrandManagerResponse> CreateBrandManagerAsync(
        CreateBrandManagerRequest request,
        CancellationToken ct = default)
    {
        var brand = await _db.Brands.FindAsync(new object[] { request.BrandId }, ct);
        if (brand is null)
        {
            throw new ArgumentException($"Brand with ID {request.BrandId} does not exist.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (await _userRepository.EmailExistsAsync(normalizedEmail, ct))
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            Role = UserRole.BrandManager,
            BrandId = request.BrandId,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _passwordHelper.Hash(user, request.Password);

        await _userRepository.AddAsync(user, ct);

        return new BrandManagerResponse(
            user.UserId,
            user.FullName,
            user.Email,
            user.Phone,
            brand.BrandId,
            brand.BrandName,
            user.CreatedAt);
    }

    public async Task<IReadOnlyList<BrandManagerResponse>> GetBrandManagersAsync(CancellationToken ct = default)
    {
        var users = await _userRepository.GetBrandManagersAsync(ct);
        return users.Select(u => new BrandManagerResponse(
            u.UserId,
            u.FullName,
            u.Email,
            u.Phone,
            u.BrandId,
            u.Brand?.BrandName,
            u.CreatedAt)).ToList();
    }

    private static UserProfileResponse MapToProfileResponse(User user) =>
        new(user.UserId, user.FullName, user.Email, user.Phone, user.Role.ToString(), user.CreatedAt, user.BrandId, user.Brand?.BrandName);
}
