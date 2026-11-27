using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Repositories;

public class PackagingRepository : IPackagingRepository
{
    private readonly RetailDbContext _context;

    public PackagingRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Packaging>> GetByProductIdAsync(
        int productId,
        bool includeInactive,
        CancellationToken ct = default)
    {
        var query = _context.Packagings
            .Include(p => p.Product)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive && p.Product.IsActive);
        }

        return await query
            .Where(p => p.ProductId == productId)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<Packaging?> GetByIdAsync(
        int id,
        bool includeInactive,
        CancellationToken ct = default)
    {
        var query = _context.Packagings
            .Include(p => p.Product)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive && p.Product.IsActive);
        }

        return await query
            .FirstOrDefaultAsync(p => p.PackagingId == id, ct);
    }

    public async Task<Packaging> AddAsync(
        Packaging entity,
        CancellationToken ct = default)
    {
        await _context.Packagings.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);

        return entity;
    }

    public async Task UpdateAsync(
        Packaging entity,
        CancellationToken ct = default)
    {
        _context.Packagings.Update(entity);
        await _context.SaveChangesAsync(ct);
    }
}