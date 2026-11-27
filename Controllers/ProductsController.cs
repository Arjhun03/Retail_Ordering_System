
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

    public ProductsController(IProductService productService)
    {
        _productService = productService;
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
}
