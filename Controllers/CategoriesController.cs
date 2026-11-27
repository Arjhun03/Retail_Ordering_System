
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retail_Ordering.Api.DTOs;
using Retail_Ordering.Api.Interfaces.Services;

namespace Retail_Ordering.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<CategoryResponse>>> GetAll(
        CancellationToken ct)
    {
        var categories = await _categoryService.GetAllAsync(false, ct);
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryResponse>> GetById(
        int id,
        CancellationToken ct)
    {
        try
        {
            return Ok(await _categoryService.GetByIdAsync(id, ct));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponse>> Create(
        CreateCategoryRequest request,
        CancellationToken ct)
    {
        try
        {
            var category = await _categoryService.CreateAsync(request, ct);

            return CreatedAtAction(
                nameof(GetById),
                new { id = category.CategoryId },
                category);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponse>> Update(
        int id,
        UpdateCategoryRequest request,
        CancellationToken ct)
    {
        try
        {
            return Ok(await _categoryService.UpdateAsync(id, request, ct));
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
            await _categoryService.DeactivateAsync(id, ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
