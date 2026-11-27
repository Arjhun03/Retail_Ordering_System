
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Services;

namespace Retail_Ordering.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IUserRepository _userRepository;

    public ProductsController(IProductService productService, IUserRepository userRepository)
    {
        _productService = productService;
        _userRepository = userRepository;
    }

    [HttpGet("my-brand")]
    [Authorize(Roles = "BrandManager,Admin")]
    public async Task<IActionResult> GetMyBrandProducts(
        [FromQuery] int? categoryId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user is null || !user.BrandId.HasValue)
            return Forbid();

        try
        {
            var result = await _productService.GetPageAsync(
                categoryId, user.BrandId.Value, search, page, pageSize, ct);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("my-brand")]
    [Authorize(Roles = "BrandManager,Admin")]
    public async Task<IActionResult> CreateMyBrandProduct(
        [FromBody] CreateMyBrandProductRequest request,
        CancellationToken ct = default)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user is null || !user.BrandId.HasValue)
            return Forbid();

        try
        {
            var fullRequest = new CreateProductRequest(
                user.BrandId.Value,
                request.CategoryId,
                request.ProductName,
                request.Description,
                request.ImageUrl);

            var result = await _productService.CreateAsync(fullRequest, ct);

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = result.ProductId },
                result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("my-brand/{id:int}")]
    [Authorize(Roles = "BrandManager,Admin")]
    public async Task<IActionResult> UpdateMyBrandProduct(
        int id,
        [FromBody] UpdateMyBrandProductRequest request,
        CancellationToken ct = default)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user is null || !user.BrandId.HasValue)
            return Forbid();

        try
        {
            var existing = await _productService.GetByIdAsync(id, ct);
            if (existing.Brand.BrandId != user.BrandId.Value)
                return Forbid();

            var fullRequest = new UpdateProductRequest(
                user.BrandId.Value,
                request.CategoryId,
                request.ProductName,
                request.Description,
                request.ImageUrl,
                request.IsActive);

            var result = await _productService.UpdateAsync(id, fullRequest, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProducts(
        [FromQuery] int? categoryId,
        [FromQuery] int? brandId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        try
        {
            var result = await _productService.GetPageAsync(
                categoryId, brandId, search, page, pageSize, ct);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProduct(
        int id,
        CancellationToken ct = default)
    {
        try
        {
            var result = await _productService.GetByIdAsync(id, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request,
        CancellationToken ct = default)
    {
        try
        {
            var result = await _productService.CreateAsync(request, ct);

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = result.ProductId },
                result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        [FromBody] UpdateProductRequest request,
        CancellationToken ct = default)
    {
        try
        {
            var result = await _productService.UpdateAsync(id, request, ct);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivateProduct(
        int id,
        CancellationToken ct = default)
    {
        try
        {
            await _productService.DeactivateAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out int userId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim, out userId);
    }
}
