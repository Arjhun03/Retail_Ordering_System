
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Services;

public class BrandService : IBrandService
{
    private readonly IBrandRepository _brandRepository;

    public BrandService(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<IReadOnlyList<BrandResponse>> GetAllAsync(
        bool includeInactive,
        CancellationToken ct = default)
    {
        var brands = await _brandRepository.GetAllAsync(includeInactive, ct);

        return brands.Select(MapToResponse).ToList();
    }

    public async Task<BrandResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default)
    {
        var brand = await _brandRepository.GetByIdAsync(id, ct);

        if (brand is null || !brand.IsActive)
            throw new KeyNotFoundException("Brand not found.");

        return MapToResponse(brand);
    }

    public async Task<BrandResponse> CreateAsync(
        CreateBrandRequest request,
        CancellationToken ct = default)
    {
        var brands = await _brandRepository.GetAllAsync(true, ct);

        bool exists = brands.Any(b =>
            string.Equals(
                b.BrandName.Trim(),
                request.BrandName.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (exists)
            throw new InvalidOperationException("Brand name already exists.");

        var brand = new Brand
        {
            BrandName = request.BrandName.Trim(),
            Description = request.Description?.Trim(),
            IsActive = true
        };

        var created = await _brandRepository.AddAsync(brand, ct);

        return MapToResponse(created);
    }

    public async Task<BrandResponse> UpdateAsync(
        int id,
        UpdateBrandRequest request,
        CancellationToken ct = default)
    {
        var brand = await _brandRepository.GetByIdAsync(id, ct);

        if (brand is null)
            throw new KeyNotFoundException("Brand not found.");

        var brands = await _brandRepository.GetAllAsync(true, ct);

        bool duplicate = brands.Any(b =>
            b.BrandId != id &&
            string.Equals(
                b.BrandName.Trim(),
                request.BrandName.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (duplicate)
            throw new InvalidOperationException("Brand name already exists.");

        brand.BrandName = request.BrandName.Trim();
        brand.Description = request.Description?.Trim();
        brand.IsActive = request.IsActive;

        await _brandRepository.UpdateAsync(brand, ct);

        return MapToResponse(brand);
    }

    public async Task DeactivateAsync(
        int id,
        CancellationToken ct = default)
    {
        var brand = await _brandRepository.GetByIdAsync(id, ct);

        if (brand is null)
            throw new KeyNotFoundException("Brand not found.");

        brand.IsActive = false;

        await _brandRepository.UpdateAsync(brand, ct);
    }

    private static BrandResponse MapToResponse(Brand brand)
    {
        return new BrandResponse(
            brand.BrandId,
            brand.BrandName,
            brand.Description,
            brand.IsActive);
    }
}
