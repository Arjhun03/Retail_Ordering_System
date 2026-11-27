
using Microsoft.EntityFrameworkCore;
using Retail_Ordering_system.Data;
using Retail_Ordering_system.DTOs;
using Retail_Ordering_system.Interfaces.Repositories;
using Retail_Ordering_system.Models;

namespace Retail_Ordering_system.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly RetailDbContext _context;

    public ProductRepository(RetailDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<ProductListItemResponse>> GetPageAsync(
        int? categoryId,
        int? brandId,
        string? search,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.Products
            .AsNoTracking()
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (brandId.HasValue)
        {
            query = query.Where(p => p.BrandId == brandId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            string searchText = search.Trim();

            query = query.Where(p =>
                p.ProductName.Contains(searchText));
        }

        int totalCount = await query.CountAsync(ct);

        var products = await query
            .OrderBy(p => p.ProductName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductListItemResponse(
                p.ProductId,
                p.ProductName,
                p.Description,
                p.ImageUrl,
                p.BrandId,
                p.Brand.BrandName,
                p.CategoryId,
                p.Category.CategoryName,
                p.IsActive))
            .ToListAsync(ct);

        return new PagedResponse<ProductListItemResponse>
        {
            Items = products,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(
                totalCount / (double)pageSize)
        };
    }

    public async Task<Product?> GetByIdAsync(
        int id,
        bool includeInactive,
        CancellationToken ct = default)
    {
        var query = _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Packagings)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        return await query.FirstOrDefaultAsync(
            p => p.ProductId == id, ct);
    }

    public async Task<Product> AddAsync(
        Product entity,
        CancellationToken ct = default)
    {
        await _context.Products.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);

        return entity;
    }

    public async Task UpdateAsync(
        Product entity,
        CancellationToken ct = default)
    {
        _context.Products.Update(entity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<bool> BrandAndCategoryExistAsync(
        int brandId,
        int categoryId,
        CancellationToken ct = default)
    {
        bool brandExists = await _context.Brands
            .AnyAsync(b => b.BrandId == brandId && b.IsActive, ct);

        bool categoryExists = await _context.Categories
            .AnyAsync(c => c.CategoryId == categoryId && c.IsActive, ct);

        return brandExists && categoryExists;
    }
}
