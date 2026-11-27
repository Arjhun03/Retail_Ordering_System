using Microsoft.EntityFrameworkCore;

namespace Retail_Ordering.Api;

public class UserRepository : IUserRepository
{
    private readonly RetailDbContext _db;

    public UserRepository(RetailDbContext db)
    {
        _db = db;
    }

    public Task<User?> GetByIdAsync(int userId, CancellationToken ct = default)
    {
        return _db.Users.FirstOrDefaultAsync(u => u.UserId == userId, ct);
    }

    public Task<User?> GetByEmailAsync(string normalizedEmail, CancellationToken ct = default)
    {
        return _db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail, ct);
    }

    public Task<bool> EmailExistsAsync(string normalizedEmail, CancellationToken ct = default)
    {
        return _db.Users.AsNoTracking().AnyAsync(u => u.Email == normalizedEmail, ct);
    }

    public async Task<User> AddAsync(User user, CancellationToken ct = default)
    {
        await _db.Users.AddAsync(user, ct);
        await _db.SaveChangesAsync(ct);
        return user;
    }

    public async Task UpdateAsync(User user, CancellationToken ct = default)
    {
        if (_db.Entry(user).State == EntityState.Detached)
        {
            _db.Users.Update(user);
        }

        await _db.SaveChangesAsync(ct);
    }
}
