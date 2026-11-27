
using Microsoft.EntityFrameworkCore;
using Retail_Ordering_system.Data;
using Retail_Ordering_system.Interfaces.Repositories;
using Retail_Ordering_system.Models;

namespace Retail_Ordering_system.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly RetailDbContext _context;

    public CategoryRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Category>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default)
    {
        IQueryable<Category> query = _context.Categories.AsNoTracking();

        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }

        return await query
            .OrderBy(c => c.CategoryName)
            .ToListAsync(ct);
    }

    public async Task<Category?> GetByIdAsync(
        int id,
        CancellationToken ct = default)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(c => c.CategoryId == id, ct);
    }

    public async Task<Category> AddAsync(
        Category entity,
        CancellationToken ct = default)
    {
        await _context.Categories.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);

        return entity;
    }

    public async Task UpdateAsync(
        Category entity,
        CancellationToken ct = default)
    {
        _context.Categories.Update(entity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> HasProductsAsync(
        int id,
        CancellationToken ct = default)
    {
        return await _context.Products
            .AnyAsync(p => p.CategoryId == id, ct);
    }
}
