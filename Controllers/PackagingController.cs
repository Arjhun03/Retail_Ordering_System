using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Services;

namespace Retail_Ordering.Api.Controllers;

[ApiController]
[Route("api")]
public class PackagingController : ControllerBase
{
    private readonly IPackagingService _packagingService;

    public PackagingController(IPackagingService packagingService)
    {
        _packagingService = packagingService;
    }

    // GET: api/products/{productId}/packaging
    [HttpGet("products/{productId:int}/packaging")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByProductId(
        int productId,
        CancellationToken ct)
    {
        try
        {
            var packaging = await _packagingService.GetByProductIdAsync(
                productId, ct);

            return Ok(packaging);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/packaging
    [HttpPost("packaging")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] CreatePackagingRequest request,
        CancellationToken ct)
    {
        try
        {
            var packaging = await _packagingService.CreateAsync(
                request, ct);

            return CreatedAtAction(
                nameof(GetByProductId),
                new { productId = packaging.ProductId },
                packaging);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // PUT: api/packaging/{id}
    [HttpPut("packaging/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatePackagingRequest request,
        CancellationToken ct)
    {
        try
        {
            var packaging = await _packagingService.UpdateAsync(
                id, request, ct);

            return Ok(packaging);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // DELETE: api/packaging/{id}
    // This deactivates packaging instead of permanently deleting it.
    [HttpDelete("packaging/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(
        int id,
        CancellationToken ct)
    {
        try
        {
            await _packagingService.DeactivateAsync(id, ct);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}