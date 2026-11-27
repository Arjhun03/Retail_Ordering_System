using Microsoft.AspNetCore.Identity;

namespace Retail_Ordering.Api;

public class PasswordHelper
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string Hash(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public PasswordVerificationResult Verify(User user, string passwordHash, string providedPassword)
    {
        return _passwordHasher.VerifyHashedPassword(user, passwordHash, providedPassword);
    }
}
