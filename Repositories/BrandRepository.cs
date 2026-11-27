
using Microsoft.EntityFrameworkCore;
using Retail_Ordering.Api.Data;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Repositories;

public class BrandRepository : IBrandRepository
{
    private readonly RetailDbContext _context;

    public BrandRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Brand>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default)
    {
        IQueryable<Brand> query = _context.Brands.AsNoTracking();

        if (!includeInactive)
        {
            query = query.Where(b => b.IsActive);
        }

        return await query
            .OrderBy(b => b.BrandName)
            .ToListAsync(ct);
    }

    public async Task<Brand?> GetByIdAsync(
        int id,
        CancellationToken ct = default)
    {
        return await _context.Brands
            .FirstOrDefaultAsync(b => b.BrandId == id, ct);
    }

    public async Task<Brand> AddAsync(
        Brand entity,
        CancellationToken ct = default)
    {
        await _context.Brands.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);

        return entity;
    }

    public async Task UpdateAsync(
        Brand entity,
        CancellationToken ct = default)
    {
        _context.Brands.Update(entity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> HasProductsAsync(
        int id,
        CancellationToken ct = default)
    {
        return await _context.Products
            .AnyAsync(p => p.BrandId == id, ct);
    }
}
