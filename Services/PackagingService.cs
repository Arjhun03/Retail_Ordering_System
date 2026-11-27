using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Services;

public class PackagingService : IPackagingService
{
    private readonly IPackagingRepository _repository;

    public PackagingService(IPackagingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<PackagingResponse>>
        GetByProductIdAsync(
            int productId,
            CancellationToken ct = default)
    {
        if (productId <= 0)
        {
            throw new ArgumentException(
                "Invalid product ID.");
        }

        var packagings = await _repository.GetByProductIdAsync(
            productId,
            includeInactive: false,
            ct);

        return packagings
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<PackagingResponse> CreateAsync(
        CreatePackagingRequest request,
        CancellationToken ct = default)
    {
        ValidatePackaging(
            request.PackagingName,
            request.Price,
            request.Unit);

        if (request.ProductId <= 0)
        {
            throw new ArgumentException(
                "Invalid product ID.");
        }

        var packaging = new Packaging
        {
            ProductId = request.ProductId,
            PackagingName = request.PackagingName.Trim(),
            Price = request.Price,
            Unit = request.Unit.Trim(),
            IsActive = true
        };

        var created = await _repository.AddAsync(
            packaging,
            ct);

        // Fetch again with Product navigation loaded
        var saved = await _repository.GetByIdAsync(
            created.PackagingId,
            includeInactive: true,
            ct);

        if (saved == null)
        {
            throw new InvalidOperationException(
                "Unable to retrieve the created packaging.");
        }

        return MapToResponse(saved);
    }

    public async Task<PackagingResponse> UpdateAsync(
        int id,
        UpdatePackagingRequest request,
        CancellationToken ct = default)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Invalid packaging ID.");
        }

        ValidatePackaging(
            request.PackagingName,
            request.Price,
            request.Unit);

        var packaging = await _repository.GetByIdAsync(
            id,
            includeInactive: true,
            ct);

        if (packaging == null)
        {
            throw new KeyNotFoundException(
                "Packaging not found.");
        }

        packaging.PackagingName =
            request.PackagingName.Trim();

        packaging.Price = request.Price;

        packaging.Unit = request.Unit.Trim();

        packaging.IsActive = request.IsActive;

        await _repository.UpdateAsync(
            packaging,
            ct);

        return MapToResponse(packaging);
    }

    public async Task DeactivateAsync(
        int id,
        CancellationToken ct = default)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Invalid packaging ID.");
        }

        var packaging = await _repository.GetByIdAsync(
            id,
            includeInactive: true,
            ct);

        if (packaging == null)
        {
            throw new KeyNotFoundException(
                "Packaging not found.");
        }

        if (!packaging.IsActive)
        {
            return;
        }

        packaging.IsActive = false;

        await _repository.UpdateAsync(
            packaging,
            ct);
    }

    private static void ValidatePackaging(
        string packagingName,
        decimal price,
        string unit)
    {
        if (string.IsNullOrWhiteSpace(packagingName))
        {
            throw new ArgumentException(
                "Packaging name is required.");
        }

        if (packagingName.Trim().Length > 50)
        {
            throw new ArgumentException(
                "Packaging name cannot exceed 50 characters.");
        }

        if (string.IsNullOrWhiteSpace(unit))
        {
            throw new ArgumentException(
                "Unit is required.");
        }

        if (unit.Trim().Length > 50)
        {
            throw new ArgumentException(
                "Unit cannot exceed 50 characters.");
        }

        if (price < 0 || price > 99999999.99m)
        {
            throw new ArgumentException(
                "Price must be between 0 and 99,999,999.99.");
        }
    }

    private static PackagingResponse MapToResponse(
        Packaging packaging)
    {
        return new PackagingResponse(
            packaging.PackagingId,
            packaging.ProductId,
            packaging.Product?.ProductName ?? "Unknown Product",
            packaging.PackagingName,
            packaging.Price,
            packaging.Unit,
            packaging.IsActive,
            packaging.Inventory?.StockQuantity);
    }
}