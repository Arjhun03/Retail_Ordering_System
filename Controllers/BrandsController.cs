
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Services;

namespace Retail_Ordering.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IBrandService _brandService;

    public BrandsController(IBrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<BrandResponse>>> GetAll(
        CancellationToken ct)
    {
        var brands = await _brandService.GetAllAsync(false, ct);
        return Ok(brands);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<BrandResponse>> GetById(
        int id,
        CancellationToken ct)
    {
        try
        {
            return Ok(await _brandService.GetByIdAsync(id, ct));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BrandResponse>> Create(
        CreateBrandRequest request,
        CancellationToken ct)
    {
        try
        {
            var brand = await _brandService.CreateAsync(request, ct);

            return CreatedAtAction(
                nameof(GetById),
                new { id = brand.BrandId },
                brand);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BrandResponse>> Update(
        int id,
        UpdateBrandRequest request,
        CancellationToken ct)
    {
        try
        {
            return Ok(await _brandService.UpdateAsync(id, request, ct));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken ct)
    {
        try
        {
            await _brandService.DeactivateAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
