
using Retail_Ordering_system.DTOs;
using Retail_Ordering_system.Interfaces.Repositories;
using Retail_Ordering_system.Interfaces.Services;
using Retail_Ordering_system.Models;

namespace Retail_Ordering_system.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IReadOnlyList<CategoryResponse>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default)
    {
        var categories = await _categoryRepository.GetAllAsync(
            includeInactive, ct);

        return categories.Select(MapToResponse).ToList();
    }

    public async Task<CategoryResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, ct);

        if (category is null || !category.IsActive)
            throw new KeyNotFoundException("Category not found.");

        return MapToResponse(category);
    }

    public async Task<CategoryResponse> CreateAsync(
        CreateCategoryRequest request,
        CancellationToken ct = default)
    {
        var categories = await _categoryRepository.GetAllAsync(true, ct);

        bool exists = categories.Any(c =>
            string.Equals(
                c.CategoryName.Trim(),
                request.CategoryName.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (exists)
            throw new InvalidOperationException("Category name already exists.");

        var category = new Category
        {
            CategoryName = request.CategoryName.Trim(),
            Description = request.Description?.Trim(),
            IsActive = true
        };

        var created = await _categoryRepository.AddAsync(category, ct);

        return MapToResponse(created);
    }

    public async Task<CategoryResponse> UpdateAsync(
        int id,
        UpdateCategoryRequest request,
        CancellationToken ct = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, ct);

        if (category is null)
            throw new KeyNotFoundException("Category not found.");

        var categories = await _categoryRepository.GetAllAsync(true, ct);

        bool duplicate = categories.Any(c =>
            c.CategoryId != id &&
            string.Equals(
                c.CategoryName.Trim(),
                request.CategoryName.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (duplicate)
            throw new InvalidOperationException("Category name already exists.");

        category.CategoryName = request.CategoryName.Trim();
        category.Description = request.Description?.Trim();
        category.IsActive = request.IsActive;

        await _categoryRepository.UpdateAsync(category, ct);

        return MapToResponse(category);
    }

    public async Task DeactivateAsync(
        int id,
        CancellationToken ct = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, ct);

        if (category is null)
            throw new KeyNotFoundException("Category not found.");

        category.IsActive = false;

        await _categoryRepository.UpdateAsync(category, ct);
    }

    private static CategoryResponse MapToResponse(Category category)
    {
        return new CategoryResponse(
            category.CategoryId,
            category.CategoryName,
            category.Description,
            category.IsActive);
    }
}
