
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Repositories;
using Retail_Ordering.Api.Interfaces.Services;
using Retail_Ordering.Api.Models;

namespace Retail_Ordering.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<PagedResponse<ProductListItemResponse>> GetPageAsync(
        int? categoryId,
        int? brandId,
        string? search,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        if (page < 1)
            throw new ArgumentException("Page must be greater than zero.");

        if (pageSize < 1 || pageSize > 100)
            throw new ArgumentException("Page size must be between 1 and 100.");

        return await _productRepository.GetPageAsync(
            categoryId, brandId, search, page, pageSize, ct);
    }

    public async Task<ProductDetailResponse> GetByIdAsync(
        int id,
        CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(
            id, false, ct);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        return MapToDetailResponse(product);
    }

    public async Task<ProductDetailResponse> CreateAsync(
        CreateProductRequest request,
        CancellationToken ct = default)
    {
        ValidateProductFields(
            request.ProductName,
            request.Description,
            request.ImageUrl);

        bool referencesExist =
            await _productRepository.BrandAndCategoryExistAsync(
                request.BrandId, request.CategoryId, ct);

        if (!referencesExist)
        {
            throw new ArgumentException(
                "Selected brand or category does not exist or is inactive.");
        }

        var product = new Product
        {
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            ProductName = request.ProductName.Trim(),
            Description = request.Description?.Trim(),
            ImageUrl = request.ImageUrl?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _productRepository.AddAsync(product, ct);

        var savedProduct = await _productRepository.GetByIdAsync(
            created.ProductId, false, ct);

        if (savedProduct is null)
            throw new InvalidOperationException("Unable to load created product.");

        return MapToDetailResponse(savedProduct);
    }

    public async Task<ProductDetailResponse> UpdateAsync(
        int id,
        UpdateProductRequest request,
        CancellationToken ct = default)
    {
        ValidateProductFields(
            request.ProductName,
            request.Description,
            request.ImageUrl);

        var product = await _productRepository.GetByIdAsync(
            id, true, ct);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        bool referencesExist =
            await _productRepository.BrandAndCategoryExistAsync(
                request.BrandId, request.CategoryId, ct);

        if (!referencesExist)
        {
            throw new ArgumentException(
                "Selected brand or category does not exist or is inactive.");
        }

        product.BrandId = request.BrandId;
        product.CategoryId = request.CategoryId;
        product.ProductName = request.ProductName.Trim();
        product.Description = request.Description?.Trim();
        product.ImageUrl = request.ImageUrl?.Trim();
        product.IsActive = request.IsActive;

        await _productRepository.UpdateAsync(product, ct);

        var updatedProduct = await _productRepository.GetByIdAsync(
            id, true, ct);

        if (updatedProduct is null)
            throw new InvalidOperationException("Unable to load updated product.");

        return MapToDetailResponse(updatedProduct);
    }

    public async Task DeactivateAsync(
        int id,
        CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(
            id, true, ct);

        if (product is null)
            throw new KeyNotFoundException("Product not found.");

        product.IsActive = false;

        await _productRepository.UpdateAsync(product, ct);
    }

    private static void ValidateProductFields(
        string productName,
        string? description,
        string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(productName))
            throw new ArgumentException("Product name is required.");

        if (productName.Trim().Length > 150)
            throw new ArgumentException("Product name cannot exceed 150 characters.");

        if (description?.Length > 500)
            throw new ArgumentException("Description cannot exceed 500 characters.");

        if (imageUrl?.Length > 500)
            throw new ArgumentException("Image URL cannot exceed 500 characters.");

        if (!string.IsNullOrWhiteSpace(imageUrl))
        {
            bool validUrl =
                Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) &&
                (uri.Scheme == Uri.UriSchemeHttp ||
                 uri.Scheme == Uri.UriSchemeHttps);

            if (!validUrl)
                throw new ArgumentException("Image URL must be a valid HTTP or HTTPS URL.");
        }
    }

    private static ProductDetailResponse MapToDetailResponse(Product product)
    {
        return new ProductDetailResponse(
            product.ProductId,
            product.ProductName,
            product.Description,
            product.ImageUrl,
            new BrandResponse(
                product.Brand.BrandId,
                product.Brand.BrandName,
                product.Brand.Description,
                product.Brand.IsActive),
            new CategoryResponse(
                product.Category.CategoryId,
                product.Category.CategoryName,
                product.Category.Description,
                product.Category.IsActive),
            Array.Empty<PackagingResponse>(),
            product.CreatedAt
        );
    }
}
